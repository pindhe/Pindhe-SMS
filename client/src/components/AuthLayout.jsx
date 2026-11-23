import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Logo from './Logo';
import './auth.css';

const AuthLayout = ({ eyebrow, title, description, children }) => (
  <main className="auth-page">
    <div className="auth-shell">
      <section className="auth-branding" aria-label="Pindhe SMS">
        <div className="auth-brand-lockup">
          <Logo className="h-11 w-11" />
          <div>
            <p className="auth-brand-name">Pindhe SMS</p>
            <p className="auth-brand-caption">School Management System</p>
          </div>
        </div>

        <div className="auth-brand-story">
          <div className="auth-illustration" aria-hidden="true">
            <div className="auth-illustration-glow" />
            <div className="auth-orbit auth-orbit--outer" />
            <div className="auth-orbit auth-orbit--inner" />
            <div className="auth-illustration-icon">
              <GraduationCap />
            </div>
            <div className="auth-float-card auth-float-card--top">
              <span className="auth-live-dot" />
              <span>One connected school</span>
              <Sparkles />
            </div>
            <div className="auth-float-card auth-float-card--bottom">
              <span className="auth-mini-icon"><BookOpen /></span>
              <span>
                <strong>Every day, in sync</strong>
                <small>Learning · People · Progress</small>
              </span>
            </div>
          </div>

          <p className="auth-story-eyebrow">A better view of your school day</p>
          <h2>Bring your school community together.</h2>
          <p className="auth-story-copy">
            Keep the people, learning, and everyday details that move your school
            forward in one thoughtful place.
          </p>
        </div>

        <div className="auth-brand-footer">
          <ShieldCheck aria-hidden="true" />
          <span>Designed for your school community</span>
        </div>
      </section>

      <section className="auth-content" aria-labelledby="auth-title">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <Logo className="h-10 w-10" />
            <span>Pindhe SMS</span>
          </div>
          <header className="auth-heading">
            <p className="auth-eyebrow">{eyebrow}</p>
            <h1 id="auth-title">{title}</h1>
            <p>{description}</p>
          </header>
          {children}
          <div className="auth-security-note">
            <ShieldCheck aria-hidden="true" />
            <span>Your school account is protected and private.</span>
          </div>
        </div>
        <p className="auth-copyright">© {new Date().getFullYear()} Pindhe SMS</p>
      </section>
    </div>
  </main>
);

export default AuthLayout;
