var bookmarkNameInput = document.getElementById("bookmarkNameInput");
var bookmarkURLInput = document.getElementById("bookmarkURLInput");
var tableBody = document.getElementById("tableBody");
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
  var bookmark = {
    name: bookmarkNameInput.value,
    url: bookmarkURLInput.value,
  };
  bookmarks.push(bookmark);
  setToLocalStorage("bookmarks", bookmarks);
  displayBookmark(bookmarks);
  clearForm();
}

function checkDuplicateName() {
  for (var i = 0; i < bookmarks.length; i++) {
    if (
      bookmarks[i].name.toLowerCase() === bookmarkNameInput.value.toLowerCase()
    ) {
      document.getElementById("duplicateModal").classList.remove("d-none");
      return true;
    }
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

"ahmed".toUpperCase();
