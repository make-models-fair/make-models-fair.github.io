//  filter table rows based on input

const filterTable = (inputId, tableId) => {
  const filter = document.getElementById(inputId).value.toUpperCase();
  const table = document.getElementById(tableId);
  const rows = table.getElementsByTagName("tr");

  for (const row of rows) {
    const cell = row.getElementsByTagName("td")[0];
    if (cell) {
      const value = cell.textContent || cell.innerText;
      if (value.toUpperCase().indexOf(filter) > -1) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  }
}
