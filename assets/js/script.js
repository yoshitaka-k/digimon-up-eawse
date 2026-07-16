document.addEventListener("DOMContentLoaded", () => {
  const cardAllDelete = document.getElementById("card-all-delete");
  if (!cardAllDelete) return;
  cardAllDelete.addEventListener("click", () => {
    const field = document.getElementById("field");
    if (!field) return;
    field.innerHTML = "";
  });
});

// カードをコピーしてフィールド上に自由配置する
document.addEventListener("DOMContentLoaded", () => {
  const field = document.getElementById("field");
  if (!field) return;

  /** @type {{ el: HTMLElement, offsetX: number, offsetY: number } | null} */
  let drag = null;

  // カードをフィールド内に配置
  function clampToField(el, left, top) {
    const maxLeft = Math.max(0, field.clientWidth - el.offsetWidth);
    const maxTop = Math.max(0, field.clientHeight - el.offsetHeight);
    el.style.left = `${Math.min(Math.max(0, left), maxLeft)}px`;
    el.style.top = `${Math.min(Math.max(0, top), maxTop)}px`;
  }

  // カードを配置
  function placeAt(source, clientX, clientY) {
    const cards = field.querySelectorAll(".placed");
    const card = /** @type {HTMLElement} */ (source.cloneNode(true));

    card.classList.add("placed");
    card.removeAttribute("id");
    card.style.left = "0px";
    card.style.top = "0px";
    field.appendChild(card);

    const fieldRect = field.getBoundingClientRect();
    clampToField(
      card,
      clientX - fieldRect.left - card.offsetWidth / 2,
      clientY - fieldRect.top - card.offsetHeight / 2,
    );
    return card;
  }

  // ドラッグ開始
  function startDrag(el, clientX, clientY) {
    const rect = el.getBoundingClientRect();
    drag = {
      el,
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
    };
    el.classList.add("dragging");
  }

  // サイドのカード → フィールドへコピーしてドラッグ開始
  document.querySelectorAll(".content-cards .content-card").forEach((card) => {
    card.addEventListener("pointerdown", (e) => {
      if (!(e instanceof PointerEvent) || e.button !== 0) return;
      e.preventDefault();
      const placed = placeAt(/** @type {HTMLElement} */ (card), e.clientX, e.clientY);
      startDrag(placed, e.clientX, e.clientY);
    });
  });

  // 配置済みカードの移動
  field.addEventListener("pointerdown", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("placed")) return;
    if (!(e instanceof PointerEvent) || e.button !== 0) return;
    e.preventDefault();
    startDrag(target, e.clientX, e.clientY);
  });

  // ダブルクリックで削除
  field.addEventListener("dblclick", (e) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.classList.contains("placed")) {
      target.remove();
    }
  });

  // ドラッグ中の移動
  document.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const fieldRect = field.getBoundingClientRect();
    clampToField(
      drag.el,
      e.clientX - fieldRect.left - drag.offsetX,
      e.clientY - fieldRect.top - drag.offsetY,
    );
  });

  // ドラッグ終了
  document.addEventListener("pointerup", () => {
    if (!drag) return;
    drag.el.classList.remove("dragging");
    drag = null;
  });
});
