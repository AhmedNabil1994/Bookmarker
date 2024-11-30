// DOM elements
var bookmarkNameInput = document.getElementById("bookmarkNameInput");
var bookmarkURLInput = document.getElementById("bookmarkURLInput");
var tableBody = document.getElementById("tableBody");
var duplicatePopup = document.querySelector(".duplicatePopup");
var validationPopup = document.querySelector(".validationPopup");
var btnAdd = document.getElementById("btnAdd");
var closeIconValidationPopup = document.querySelector(
  ".validationPopup span.fa-close"
);
var closeIconDuplicatePopup = document.querySelector(
  ".duplicatePopup span.fa-close"
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
  } else {
    validationPopup.classList.replace("d-none", "d-flex");
  }
}

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

function deleteBookmark(index) {
  bookmarks.splice(index, 1);
  setToLocalStorage("bookmarks", bookmarks);
  displayBookmark(bookmarks);
}

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
}

function setToLocalStorage(key, val) {
  return localStorage.setItem(key, JSON.stringify(val));
}

function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function checkDuplicateName() {
  for (var i = 0; i < bookmarks.length; i++) {
    if (
      bookmarks[i].name.toLowerCase() === bookmarkNameInput.value.toLowerCase()
    ) {
      duplicatePopup.classList.remove("d-none");
      return true;
    }
  }
}

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
    btnAdd.classList.remove("disabled");
    input.nextElementSibling.classList.replace("d-block", "d-none");
  } else {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    btnAdd.classList.add("disabled");
    input.nextElementSibling.classList.replace("d-none", "d-block");
  }
  if (
    regex["bookmarkNameInput"].test(bookmarkNameInput.value) &&
    regex["bookmarkURLInput"].test(bookmarkURLInput.value)
  ) {
    btnAdd.classList.remove("disabled");
  } else {
    btnAdd.classList.add("disabled");
  }
  return isValid;
}

closeIconValidationPopup.addEventListener("click", function () {
  closePopup(validationPopup);
});

closeIconDuplicatePopup.addEventListener("click", function () {
  closePopup(duplicatePopup);
});

validationPopup.addEventListener("click", function () {
  closePopup(validationPopup);
});

popupBox.addEventListener("click", function (e) {
  e.stopPropagation();
});

function closePopup(popup) {
  popup.classList.add("d-none");
}

(function checkEmptyInputs() {
  if (bookmarkNameInput.value !== "" && bookmarkURLInput.value !== "") {
    btnAdd.classList.remove("disabled");
  } else {
    btnAdd.classList.add("disabled");
  }
})();
