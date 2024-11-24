<template>
  <div class="about-container">
    <!-- Header Section -->
    <header class="about-header">
      <h1>About Us</h1>
      <p class="header-subtitle">Empowering businesses with smart client management solutions</p>
    </header>

    <router-link to="/" class="back-button">
    ← Back
    </router-link>

    <!-- Main Content -->
    <main class="about-content">
      <!-- Overview Section -->
      <section class="overview-section">
        <h2>Who We Are</h2>
        <p>Our Sales and Client Management System is designed to streamline your business operations and enhance client relationships. With powerful tools and intuitive interfaces, we help businesses grow and succeed in today's competitive market.</p>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <h2>Key Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Sales Analytics</h3>
            <p>Comprehensive analytics and reporting tools to track your sales performance</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Client Management</h3>
            <p>Efficient client database management and relationship tracking</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3>Efficient Reports</h3>
            <p>Generate detailed reports and insights for better decision making</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Mobile Access</h3>
            <p>Access your data anywhere, anytime with our mobile-friendly platform</p>
          </div>
        </div>
      </section>

      <!-- Mission & Vision Section -->
      <section class="mission-section">
        <div class="mission-content">
          <div class="mission-box">
            <h2>Our Mission</h2>
            <p>To provide businesses with powerful, user-friendly tools that enhance client relationships and drive sales growth.</p>
          </div>
          <div class="mission-box">
            <h2>Our Vision</h2>
            <p>To become the leading solution in sales and client management, empowering businesses worldwide to achieve their full potential.</p>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="team-section">
        <h2>Our Team</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">👨‍💼</div>
            <h3>John Smith</h3>
            <p>CEO & Founder</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">👩‍💼</div>
            <h3>Sarah Johnson</h3>
            <p>Head of Development</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">👨‍💻</div>
            <h3>Mike Wilson</h3>
            <p>Lead Designer</p>
          </div>
          <div class="team-member">
            <div class="member-avatar">👩‍💻</div>
            <h3>Emily Brown</h3>
            <p>Customer Success</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

/* Container */
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header Styles */
.about-header {
  text-align: center;
  padding: 3rem 0;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border-radius: 12px;
}

.about-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.header-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Section Styles */
section {
  margin-bottom: 4rem;
}

h2 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Overview Section */
.overview-section {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 4rem;
}

.overview-section p {
  font-size: 1.1rem;
  color: #4b5563;
}

/* Features Section */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #6b7280;
}

/* Mission & Vision Section */
.mission-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.mission-box {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mission-box h2 {
  color: #2563eb;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.mission-box p {
  color: #4b5563;
}

/* Team Section */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.team-member {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.team-member:hover {
  transform: translateY(-5px);
}

.member-avatar {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.team-member h3 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.team-member p {
  color: #6b7280;
}

.back-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 100;
}

.back-button:hover {
  background-color: #1d4ed8;
  transform: translateX(-5px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .about-container {
    padding: 1rem;
  }

  .about-header {
    padding: 2rem 1rem;
  }

  .about-header h1 {
    font-size: 2rem;
  }

  .header-subtitle {
    font-size: 1rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .mission-content {
    grid-template-columns: 1fr;
  }

  .features-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }
  .back-button {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
