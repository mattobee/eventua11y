document.addEventListener("DOMContentLoaded", (event) => {
  console.log("Hello from main.js");
  const filterDrawer = document.getElementById("filter-drawer");
  const filterToolbar = document.querySelector('#filters');
  const openButton = document.getElementById("open-filter-drawer");
  openButton.addEventListener("click", () => filterDrawer.show());
  const noJsElements = document.querySelectorAll(".no-js");
  noJsElements.forEach((element) => {
    element.classList.remove("no-js");
  });

  const observer = new IntersectionObserver( 
  ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
  { threshold: [1] }
  );
  
  observer.observe(filterToolbar);

});

// Store the initial state of the filters
// const initialFilters = {
//   cfsOpen: false,
//   cfsClosed: false,
//   attendanceOnline: false,
//   attendanceOffline: false,
//   themes: true,
//   all: false,
// };

document.addEventListener("alpine:init", () => {

  // Initialize the filters store with the initial state
  const initialFilters = {
    cfsOpen: false,
    cfsClosed: false,
    attendanceOnline: false,
    attendanceOffline: false,
    themes: true,
  };

  Alpine.store("filters", { ...initialFilters, initialFilters });
  Alpine.store("filters").totalEventCount = 0;
  Alpine.store("filters").visibleEventCount = 0;

  // Count the total number of events on the page
  const totalEvents = document.querySelectorAll(".event");
  Alpine.store("filters").totalEventCount = totalEvents.length;

  // Add a method to reset the filters to the initial state
  Alpine.store("filters").reset = () => {
    const initialFilters = Alpine.store("filters").initialFilters;
    Object.keys(initialFilters).forEach((key) => {
      Alpine.store("filters")[key] = initialFilters[key];
    });
    // After resetting the filters, re-filter the events
    Alpine.store("filters").filterEvents();
  };

  Alpine.store("filters").filterEvents = () => {
    // Select all events on the page
    const events = document.querySelectorAll(".event");
    const monthSections = document.querySelectorAll(".month");

    // Loop over the events
    events.forEach((event) => {
      // Get the event type, attendance mode, and cfs status
      const eventType = event.getAttribute("data-event-type");
      const eventAttendanceMode = event.getAttribute("data-event-attendancemode");
      const eventCfsStatus = event.getAttribute("data-event-cfs") !== null;

      // If the 'themes' filter is false and the event type is 'theme', hide the event
      // If the 'themes' filter is true and the event type is 'theme', show the event
      if (eventType === "theme") {
        event.hidden = !Alpine.store("filters").themes;
      } else {
        // Check if the event matches the attendance mode filter
        const matchesAttendanceMode =
          (!Alpine.store("filters").attendanceOnline &&
            !Alpine.store("filters").attendanceOffline) ||
          (Alpine.store("filters").attendanceOnline &&
            (eventAttendanceMode === "online" ||
              eventAttendanceMode === "mixed")) ||
          (Alpine.store("filters").attendanceOffline &&
            (eventAttendanceMode === "offline" ||
              eventAttendanceMode === "mixed"));

        // Check if the event matches the cfs filter
        const matchesCfs =
          (!Alpine.store("filters").cfsOpen &&
            !Alpine.store("filters").cfsClosed) ||
          (Alpine.store("filters").cfsOpen && eventCfsStatus) ||
          (Alpine.store("filters").cfsClosed && !eventCfsStatus);

        // If the event matches all filter criteria, show the event; otherwise, hide it
        event.hidden = !(matchesAttendanceMode && matchesCfs);
      }

      // After filtering the events, check each month section
      monthSections.forEach((section) => {
        // Select all visible events in the section
        const visibleEvents = section.querySelectorAll(".event:not([hidden])");

        // If there are no visible events in the section, hide the section
        section.hidden = visibleEvents.length === 0;
      });

      // Select the .events div in #Today
      const todayEvents = document.querySelector('#today .events');
      // Select all visible events in the .events div
      const visibleTodayEvents = todayEvents.querySelectorAll(".event:not([hidden])");
      // If there are no visible events in the .events div, hide the div
      todayEvents.hidden = visibleTodayEvents.length === 0;

    });

    // After filtering the events, count the visible events
    const visibleEvents = document.querySelectorAll(".event:not([hidden])");
    Alpine.store("filters").visibleEventCount = visibleEvents.length;

  };

  // Add a method to check if the filters have changed
  Alpine.store("filters").isChanged = function() {
    return Object.keys(this.initialFilters).some(key => this[key] !== this.initialFilters[key]);
  };

  // Filter the events immediately after initializing the store
  Alpine.store("filters").filterEvents();

});
