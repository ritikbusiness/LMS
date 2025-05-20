import { Express } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";

// Configure passport to use Google OAuth
export function setupAuthRoutes(app: Express): void {
  // Set up passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  
  // Add test login route
  app.post('/api/auth/test-login', async (req, res) => {
    try {
      const { role } = req.body;
      
      // Create or get test user based on role
      let user;
      
      if (role === 'instructor') {
        // Check if test instructor exists
        user = await storage.getUserByEmail('test.instructor@example.com');
        
        if (!user) {
          // Create test instructor
          user = await storage.createUser({
            email: 'test.instructor@example.com',
            fullName: 'Test Instructor',
            role: 'instructor',
            googleId: 'test-instructor-id',
            avatarUrl: 'https://ui-avatars.com/api/?name=Test+Instructor&background=0D8ABC&color=fff',
            branch: null,
            year: null,
            domain: 'MERN',
            xpPoints: 100,
            stripeCustomerId: null,
            createdAt: new Date()
          });
        }
      } else if (role === 'premium') {
        // Create premium user with special access
        user = await storage.getUserByEmail('premium.user@example.com');
        
        if (!user) {
          // Create premium user
          user = await storage.createUser({
            email: 'premium.user@example.com',
            fullName: 'Premium User',
            role: 'premium',
            googleId: 'premium-user-id',
            avatarUrl: 'https://ui-avatars.com/api/?name=Premium+User&background=722ED1&color=fff',
            branch: 'Premium Access',
            year: 'All',
            domain: 'All Domains',
            xpPoints: 500,
            stripeCustomerId: 'premium_customer_123',
            createdAt: new Date()
          });
        }
      } else {
        // Check if test student exists
        user = await storage.getUserByEmail('test.student@example.com');
        
        if (!user) {
          // Create test student
          user = await storage.createUser({
            email: 'test.student@example.com',
            fullName: 'Test Student',
            role: 'student',
            googleId: 'test-student-id',
            avatarUrl: 'https://ui-avatars.com/api/?name=Test+Student&background=0D8ABC&color=fff',
            branch: 'Computer Science',
            year: '2',
            domain: 'DevOps',
            xpPoints: 50,
            stripeCustomerId: null,
            createdAt: new Date()
          });
        }
      }
      
      // Log in the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Login failed', error: err });
        }
        return res.json({ user });
      });
    } catch (error) {
      console.error('Test login error:', error);
      res.status(500).json({ message: 'Login failed', error });
    }
  });

  // Set up Google OAuth strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
        callbackURL: "/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists
          let user = await storage.getUserByGoogleId(profile.id);

          if (user) {
            // Update user info if needed
            if (profile.emails && profile.emails[0] && profile.photos && profile.photos[0]) {
              user = await storage.updateUser(user.id, {
                email: profile.emails[0].value,
                avatarUrl: profile.photos[0].value,
              });
            }
            return done(null, user);
          }

          // Validate email domain for college restriction
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          if (!email) {
            return done(new Error("Email is required"), null);
          }

          // For demo purposes, allow all emails
          // In production, you would validate the email domain:
          // if (!email.endsWith('@college.edu')) {
          //   return done(new Error('Only college emails are allowed'), null);
          // }

          // Create new user
          const newUser = await storage.createUser({
            email: email,
            fullName: profile.displayName || "New User",
            role: "student",
            googleId: profile.id,
            avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          });

          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Set up authentication routes
  app.get(
    "/api/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login?error=auth_failed",
    }),
    (req, res) => {
      // Check if user needs to complete onboarding
      const user = req.user as any;
      if (!user.domain) {
        return res.redirect("/onboarding");
      }
      res.redirect("/");
    }
  );

  // Get current user information
  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    return res.status(401).json({ message: "Unauthorized" });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
}
