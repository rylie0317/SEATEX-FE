<template>

  <footer class="seatex-footer">

    <div class="container">

      <div class="seatex-footer-main">

        <!-- BRAND -->
        <div class="seatex-footer-brand">

          <img
            src="/SEATEX_logo.jpg"
            alt="SeatEx Logo"
            class="seatex-footer-logo"
          />

          <div>

            <div class="seatex-footer-name">
              <span>SEATEX</span>
            </div>

            <p>
              Online Bus Booking System
            </p>

          </div>

        </div>


        <!-- DESCRIPTION -->
        <div class="seatex-footer-description">

          <p>
            SeatEx helps passengers find available bus trips,
            check seat availability, and reserve their trip online.
          </p>

        </div>


        <!-- QUICK LINKS -->
        <div class="seatex-footer-links">

          <a href="/#about">
            About
          </a>

          <a href="/#contact">
            Contact
          </a>

          <router-link to="/trips">
            Trips
          </router-link>

        </div>

      </div>


      <!-- COPYRIGHT -->
      <div class="seatex-footer-bottom">

        <span>
          © 2026 SeatEx. All rights reserved.
        </span>

        <span>
          Online Bus Booking System
        </span>

      </div>

    </div>

  </footer>

</template>


<style scoped>

.seatex-footer {
  background-color: #ffffff;
  border-top: 1px solid var(--seatex-border);
}


.seatex-footer-main {
  display: grid;
  grid-template-columns: 1.2fr 1.5fr 0.8fr;
  align-items: center;
  gap: 50px;

  padding: 45px 0;
}


/* BRAND */

.seatex-footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}


.seatex-footer-logo {
  width: 48px;
  height: 48px;

  object-fit: contain;

  border-radius: 10px;
}


.seatex-footer-name {
  color: var(--seatex-navy);

  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.5px;
}


.seatex-footer-name span {
  color: var(--seatex-primary);
}


.seatex-footer-brand p {
  margin: 2px 0 0;

  color: var(--seatex-muted);

  font-size: 11px;
}


/* DESCRIPTION */

.seatex-footer-description {
  max-width: 430px;
}


.seatex-footer-description p {
  margin: 0;

  color: var(--seatex-muted);

  font-size: 13px;
  line-height: 1.7;
}


/* LINKS */

.seatex-footer-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  gap: 9px;
}


.seatex-footer-links a {
  color: var(--seatex-muted);

  font-size: 13px;

  transition: color 0.2s ease;
}


.seatex-footer-links a:hover {
  color: var(--seatex-primary);
}


/* BOTTOM */

.seatex-footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 18px 0;

  border-top: 1px solid var(--seatex-border);

  color: var(--seatex-subtle);

  font-size: 11px;
}


/* RESPONSIVE */

@media (max-width: 768px) {

  .seatex-footer-main {
    grid-template-columns: 1fr;
    gap: 25px;

    padding: 35px 0;
  }


  .seatex-footer-description {
    max-width: 600px;
  }


  .seatex-footer-links {
    flex-direction: row;
    flex-wrap: wrap;
  }


  .seatex-footer-bottom {
    flex-direction: column;
    align-items: flex-start;

    padding: 16px 0;
  }

}

</style>