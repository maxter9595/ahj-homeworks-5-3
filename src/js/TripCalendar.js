import moment from "moment";
import flatpickr from "flatpickr";

import "moment/locale/ru";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/l10n/ru.js";

class TripCalendar {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    this.init();
  }

  init() {
    this.departureDate = this.form.querySelector("#departure-date");
    this.returnDate = this.form.querySelector("#return-date");
    this.roundTripCheckbox = this.form.querySelector("#round-trip");
    this.successMessage = this.form.querySelector("#success-message");
    this.returnDateGroup = this.form.querySelector("#return-date-group");
    this.passengerInput = this.form.querySelector("#passengers");
    this.passengerMinus = this.form.querySelector(".passenger-minus");
    this.passengerPlus = this.form.querySelector(".passenger-plus");
    this.initFlatpickr();
    this.today = moment().format("YYYY-MM-DD");
    this.setupDateInputs();
    this.addEventListeners();
    this.setupPassengerControls();
    this.loadFormData();
    this.removeTitleAttributes();
    this.roundTripCheckbox.addEventListener("change", () => {
      this.toggleReturnDateVisibility();
      this.checkReturnDateValidity();
    });
  }

  toggleReturnDateVisibility() {
    if (this.roundTripCheckbox.checked) {
      this.returnDateGroup.style.display = "block";
      this.returnDate.disabled = false;
      this.returnDate.required = true;
    } else {
      this.returnDateGroup.style.display = "none";
      this.returnDate.disabled = true;
      this.returnDate.required = false;
    }
  }

  checkReturnDateValidity() {
    if (this.roundTripCheckbox.checked) {
      const departureDate = moment(this.departureDate.value);
      const returnDate = moment(this.returnDate.value);
      if (returnDate.isBefore(departureDate)) {
        this.returnDate.setCustomValidity(
          "Дата возврата должна быть позже даты отправления",
        );
      } else {
        this.returnDate.setCustomValidity("");
      }
    }
  }

  removeTitleAttributes() {
    const inputs = this.form.querySelectorAll("input");
    inputs.forEach((input) => input.removeAttribute("title"));
  }

  loadFormData() {
    const savedData = JSON.parse(localStorage.getItem("tripFormData")) || {};
    if (savedData.from) this.form.querySelector("#from").value = savedData.from;
    if (savedData.to) this.form.querySelector("#to").value = savedData.to;
    if (savedData.passengers) this.passengerInput.value = savedData.passengers;
    if (savedData.departureDate)
      this.departureDate.value = savedData.departureDate;
    if (savedData.returnDate) this.returnDate.value = savedData.returnDate;
    if (savedData.roundTrip)
      this.roundTripCheckbox.checked = savedData.roundTrip;
    if (savedData.roundTrip) {
      this.returnDateGroup.style.display = "block";
      this.returnDate.disabled = false;
      this.returnDate.required = true;
    }
  }

  saveFormData() {
    const formData = {
      from: this.form.querySelector("#from").value,
      to: this.form.querySelector("#to").value,
      passengers: this.passengerInput.value,
      departureDate: this.departureDate.value,
      returnDate: this.returnDate.value,
      roundTrip: this.roundTripCheckbox.checked,
    };
    localStorage.setItem("tripFormData", JSON.stringify(formData));
  }

  initFlatpickr() {
    flatpickr(this.departureDate, {
      minDate: "today",
      dateFormat: "Y-m-d",
      locale: "ru",
      onChange: (selectedDates) => {
        if (this.roundTripCheckbox.checked) {
          this.returnDate._flatpickr.set("minDate", selectedDates[0]);
          this.checkReturnDateValidity();
        }
      },
    });
    flatpickr(this.returnDate, {
      minDate: "today",
      dateFormat: "Y-m-d",
      locale: "ru",
      onChange: () => {
        this.checkReturnDateValidity();
      },
    });
  }

  setupPassengerControls() {
    this.passengerMinus.addEventListener("click", () => {
      let value = parseInt(this.passengerInput.value, 10);
      if (value > 1) {
        this.passengerInput.value = value - 1;
        this.saveFormData();
      }
    });
    this.passengerPlus.addEventListener("click", () => {
      let value = parseInt(this.passengerInput.value, 10);
      this.passengerInput.value = value + 1;
      this.saveFormData();
    });
  }

  setupDateInputs() {
    this.departureDate._flatpickr.set("minDate", this.today);
    this.returnDate._flatpickr.set("minDate", this.today);
    this.returnDateGroup.style.display = "none";
  }

  addEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validateForm()) {
        this.showSuccessMessage();
        localStorage.removeItem("tripFormData");
      }
    });
  }

  hideAllPopovers() {
    const popovers = this.form.querySelectorAll(".popover");
    popovers.forEach((popover) => {
      popover.style.display = "none";
    });
  }

  showPopover(input) {
    const popover = input.parentElement.querySelector(".popover");
    if (popover) {
      popover.style.display = "block";
      setTimeout(() => {
        popover.style.display = "none";
      }, 2000);
    }
  }

  validateForm() {
    let isValid = true;
    const fromInput = this.form.querySelector("#from");
    const toInput = this.form.querySelector("#to");
    const departureDate = this.form.querySelector("#departure-date");
    const returnDate = this.form.querySelector("#return-date");
    this.hideAllPopovers();
    if (!fromInput.value.trim()) {
      isValid = false;
      fromInput.classList.add("error");
      this.showPopover(fromInput);
    } else {
      fromInput.classList.remove("error");
    }
    if (!toInput.value.trim()) {
      isValid = false;
      toInput.classList.add("error");
      this.showPopover(toInput);
    } else {
      toInput.classList.remove("error");
    }
    if (!departureDate.value) {
      isValid = false;
      departureDate.classList.add("error");
      this.showPopover(departureDate);
    } else {
      departureDate.classList.remove("error");
    }
    if (this.roundTripCheckbox.checked && !returnDate.value) {
      isValid = false;
      returnDate.classList.add("error");
      this.showPopover(returnDate);
    } else {
      returnDate.classList.remove("error");
    }
    return isValid;
  }

  showSuccessMessage() {
    this.successMessage.classList.remove("hidden");
    setTimeout(() => {
      this.successMessage.classList.add("hidden");
    }, 3000);
  }
}

export default TripCalendar;
