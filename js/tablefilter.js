const initializeModelFilters = () => {
  for (const input of document.querySelectorAll("[data-model-filter]")) {
    const table = document.getElementById(input.dataset.tableId);
    const status = document.getElementById(input.dataset.statusId);
    if (!table || !status) continue;

    const rows = [...table.tBodies[0].rows];
    const update = () => {
      const query = input.value.trim().toLocaleLowerCase();
      let visible = 0;

      for (const row of rows) {
        const matches = row.textContent.toLocaleLowerCase().includes(query);
        row.hidden = !matches;
        if (matches) visible += 1;
      }

      status.textContent = `${visible} of ${rows.length} models shown`;
    };

    input.addEventListener("input", update);
    update();
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeModelFilters, { once: true });
} else {
  initializeModelFilters();
}
