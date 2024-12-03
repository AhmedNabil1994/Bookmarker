// DOM elements
var bookmarkNameInput = document.getElementById("bookmarkNameInput");
var bookmarkURLInput = document.getElementById("bookmarkURLInput");
var tableBody = document.getElementById("tableBody");
var validationPopup = document.querySelector(".validationPopup");
var btnAdd = document.getElementById("btnAdd");
var closeIconValidationPopup = document.querySelector(
  ".validationPopup span.fa-close"
);
var popupBox = document.querySelector(".modal-dialog");
// arrays
var bookmarks = [];

(function retrieveBookmarks() {
  bookmarks = getFromLocalStorage("bookmarks")
    ? getFromLocalStorage("bookmarks")
    : bookmarks;
  displayBookmark(bookmarks);
})();

function createBookmark() {
  if (checkDuplicateName()) {
    return;
  }
  if (validateForm(bookmarkNameInput) && validateForm(bookmarkURLInput)) {
    var bookmark = {
      name: bookmarkNameInput.value,
      url: bookmarkURLInput.value,
    };
    bookmarks.push(bookmark);
    setToLocalStorage("bookmarks", bookmarks);
    displayBookmark(bookmarks);
    clearForm();
  } else if (
    validateForm(bookmarkNameInput) &&
    !validateForm(bookmarkURLInput)
  ) {
    Swal.fire({
      icon: "error",
      title: "Invalid URL",
      text: "Please enter a valid URL following these rules:",
      html: `
        <ul style="text-align: left;">
          <li>Must include a valid domain (e.g., google.com).</li>
          <li>Optional: Protocol (http:// or https://).</li>
          <li>Optional: Subdomain (e.g., www).</li>
          <li>Minimum a single character for the domain name.</li>
          <li>Domain extension (e.g., .com, .org) is required.</li>
        </ul>
      `,
      confirmButtonText: "OK",
    });
  } else if (
    !validateForm(bookmarkNameInput) &&
    validateForm(bookmarkURLInput)
  ) {
    Swal.fire({
      icon: "error",
      title: "Invalid Site Name",
      text: "Please enter a valid Name following these rules:",
      html: `
        <ul style="text-align: left;">
          <li>Must include at least 3 characters.</li>
          <li>Can start with _ or numbers.</li>
          <li>Can not start with any special character except _</li>
        </ul>
      `,
      confirmButtonText: "OK",
    });
  } else {
    validationPopup.classList.replace("d-none", "d-flex");
  }
}

/**
 * Display bookmarks in the table
 * @param{object[]}list - an array of objects
 */
function displayBookmark(list) {
  var bookmarkEl = "";
  for (var index = 0; index < list.length; index++) {
    bookmarkEl += ` <tr>
                        <th scope="row">${index + 1}</th>
                        <td>${
                          list[index].name.charAt(0).toUpperCase() +
                          list[index].name.slice(1)
                        }</td>
                        <td>
                        <button
                            id="btnVisit"
                            class="btn btn-success"
                            onclick="visitBookmark(${index})"
                        >
                            <i class="fa fa-solid fa-eye"></i>
                            Visit
                        </button>
                        </td>
                        <td>
                        <button
                            id="btnDelete"
                            class="btn btn-danger"
                            onclick="deleteBookmark(${index})"
                        >
                            <i class="fa fa-solid fa-trash-can"></i>
                            Delete
                        </button>
                        </td>
                    </tr>`;
  }
  tableBody.innerHTML = bookmarkEl;
}

/**
 * Delete a bookmark from the table
 * @param{number}index - a bookmark index of type number
 */
function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  setToLocalStorage("bookmarks", bookmarks);
  displayBookmark(bookmarks);
}

/**
 * Visit a bookmark utl
 * @param{number}index - a bookmark index of type number
 */
function visitBookmark(index) {
  if (
    !bookmarks[index].url.startsWith("http://") &&
    !bookmarks[index].url.startsWith("https://")
  ) {
    bookmarks[index].url = "https://" + bookmarks[index].url;
  }
  window.open(bookmarks[index].url, "_blank");
}

function clearForm() {
  bookmarkNameInput.value = null;
  bookmarkURLInput.value = null;
  bookmarkNameInput.classList.remove("is-valid");
  bookmarkURLInput.classList.remove("is-valid");
}

/**
 * Set a value to the localstorage
 * @param{string}key - localstorage object key
 * @param{object[]}val - an array of objects
 */
function setToLocalStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

/**
 * Get a value from the localstorage
 * @param{string}key - localstorage object key
 * @returns{object[]} - return an array of objects
 */
function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

/**
 * Check if the bookmark name is duplicated
 * @returns{boolean} - return true if name is repeated
 */
function checkDuplicateName() {
  for (var i = 0; i < bookmarks.length; i++) {
    if (
      bookmarks[i].name.toLowerCase() === bookmarkNameInput.value.toLowerCase()
    ) {
      Swal.fire({
        icon: "error",
        title: "This name already exists",
        text: ` Please choose a different name.`,
        confirmButtonText: "OK",
      });
      return true;
    }
  }
}

/**
 * Validates the input of an HTML form element
 * against a specific regular expression based on its `id`
 * @param{HTMLElement}input - The HTML input element to validate.
 * @returns{boolean} - Returns `true` if the input value matches the regex,
 *  otherwise `false`
 */
function validateForm(input) {
  var regex = {
    bookmarkNameInput: /^\w{3,}$/,
    bookmarkURLInput:
      /^(https?:\/\/(?:www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
  };
  var isValid = regex[input.id].test(input.value);
  if (isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    input.nextElementSibling.classList.replace("d-block", "d-none");
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    input.nextElementSibling.classList.replace("d-none", "d-block");
  }
  return isValid;
}

function closePopup(el, popup) {
  el.addEventListener("click", function (e) {
    el === popupBox ? e.stopPropagation() : close(popup);
  });
}

function close(popup) {
  popup.classList.add("d-none");
}
// invoking closePopup fn
closePopup(closeIconValidationPopup, validationPopup);

closePopup(validationPopup, validationPopup);

closePopup(popupBox);


