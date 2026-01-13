const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./modules/auth/auth.routes");
const orgRoutes = require("./modules/org/org.routes");
const projectRoutes = require("./modules/projects/project.routes");
const memberRoutes = require("./modules/org/member.routes");
const taskRoutes = require("./modules/tasks/task.routes");
const inviteRoutes = require("./modules/org/invite.routes");
const billingRoutes = require("./modules/billing/billing.routes");
const webhookRoutes = require("./modules/billing/webhook.routes");

const rateLimit = require("./middlewares/rateLimit");
const errHandler = require("./middlewares/error.middleware");

const app = express();


app.get("/health", (req, res) => res.json({ status: "OK" }));
/* =========================
   CORS + SECURITY
========================= */
app.use(cors({
  origin: ["http://localhost:3002", "https://portfolio-production-8f70.up.railway.app"],
  credentials: true
}));
app.use(helmet());

/* =========================
   🚨 STRIPE WEBHOOK (RAW)
   MUST COME BEFORE JSON
========================= */
app.use("/billing", webhookRoutes);

/* =========================
   JSON PARSER (NORMAL APIs)
========================= */
app.use(express.json());

/* =========================
   LOGGING
========================= */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser());
app.disable("x-powered-by")
app.set("trust proxy", 1)
app.use(
  rateLimit({
    windowSeconds: 60,
    maxRequests: 1000, // per IP
  })
);


/* =========================
   ROUTES
========================= */
app.use("/auth", authRoutes);
app.use("/orgs", orgRoutes);
app.use("/projects", projectRoutes);
app.use("/members", memberRoutes);
app.use("/tasks", taskRoutes);
app.use("/invites", inviteRoutes);
app.use("/billing", billingRoutes);

/* =========================
   HEALTH
========================= */
app.get("/", (req, res) => {
 
  res.send("Multi-Tenant SaaS Backend Running");
});


/* =========================
   ❗ ERROR HANDLER (LAST)
========================= */
app.use(errHandler);

module.exports = app;
