import TripCalendar from "../TripCalendar"; // предполагается, что класс в этом файле
import { jest } from "@jest/globals";

describe("TripCalendar", () => {
  let tripCalendar;
  let formElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="trip-form">
        <input type="text" id="from" />
        <input type="text" id="to" />
        <input type="date" id="departure-date" />
        <input type="date" id="return-date" />
        <input type="checkbox" id="round-trip" />
        <div id="return-date-group">
          <input type="date" id="return-date" />
        </div>
        <input type="number" id="passengers" />
        <button type="button" class="passenger-minus">-</button>
        <button type="button" class="passenger-plus">+</button>
        <button type="submit">Submit</button>
        <div id="success-message" class="hidden">Success</div>
      </form>
    `;
    formElement = document.querySelector("#trip-form");
    tripCalendar = new TripCalendar("#trip-form");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize correctly", () => {
    expect(tripCalendar.departureDate).not.toBeNull();
    expect(tripCalendar.returnDate).not.toBeNull();
    expect(tripCalendar.roundTripCheckbox).not.toBeNull();
    expect(tripCalendar.successMessage).not.toBeNull();
    expect(tripCalendar.returnDateGroup).not.toBeNull();
    expect(tripCalendar.passengerInput).not.toBeNull();
    expect(tripCalendar.passengerMinus).not.toBeNull();
    expect(tripCalendar.passengerPlus).not.toBeNull();
  });

  test("should toggle return date visibility when round trip is checked", () => {
    tripCalendar.roundTripCheckbox.checked = true;
    tripCalendar.roundTripCheckbox.dispatchEvent(new Event("change"));
    expect(tripCalendar.returnDateGroup.style.display).toBe("block");
    expect(tripCalendar.returnDate.disabled).toBeFalsy();
    expect(tripCalendar.returnDate.required).toBeTruthy();
  });

  test("should hide return date when round trip is unchecked", () => {
    tripCalendar.roundTripCheckbox.checked = false;
    tripCalendar.roundTripCheckbox.dispatchEvent(new Event("change"));
    expect(tripCalendar.returnDateGroup.style.display).toBe("none");
    expect(tripCalendar.returnDate.disabled).toBeTruthy();
    expect(tripCalendar.returnDate.required).toBeFalsy();
  });

  test("should validate form inputs correctly", () => {
    tripCalendar.form.querySelector("#from").value = "";
    tripCalendar.form.querySelector("#to").value = "";
    tripCalendar.form.querySelector("#departure-date").value = "";
    tripCalendar.form.querySelector("#round-trip").checked = true;
    tripCalendar.form.querySelector("#return-date").value = "";
    const isValid = tripCalendar.validateForm();
    expect(isValid).toBe(false);
    expect(
      tripCalendar.form.querySelector("#from").classList.contains("error"),
    ).toBeTruthy();
    expect(
      tripCalendar.form.querySelector("#to").classList.contains("error"),
    ).toBeTruthy();
    expect(
      tripCalendar.form
        .querySelector("#departure-date")
        .classList.contains("error"),
    ).toBeTruthy();
    expect(
      tripCalendar.form
        .querySelector("#return-date")
        .classList.contains("error"),
    ).toBeTruthy();
  });

  test("should show success message when form is valid", () => {
    tripCalendar.form.querySelector("#from").value = "New York";
    tripCalendar.form.querySelector("#to").value = "Paris";
    tripCalendar.form.querySelector("#departure-date").value = "2025-01-01";
    tripCalendar.form.querySelector("#round-trip").checked = true;
    tripCalendar.form.querySelector("#return-date").value = "2025-01-15";
    tripCalendar.form.dispatchEvent(new Event("submit"));
    const successMessage = tripCalendar.successMessage;
    expect(successMessage.classList.contains("hidden")).toBe(false);
    setTimeout(() => {
      expect(successMessage.classList.contains("hidden")).toBe(true);
    }, 3000);
  });
});
