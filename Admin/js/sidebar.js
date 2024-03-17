document.addEventListener('DOMContentLoaded', function() {
    const menuLinks = document.querySelectorAll('.sidebar ul li');
    menuLinks.forEach(link => {
        const aTag = link.querySelector('a');
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const className = aTag.getAttribute('data-target');
            showContent(className);
        });
    });

    const menuItems = document.querySelectorAll('.sidebar ul li');
    menuItems.forEach(item => {
        item.addEventListener('click', handleMenuItemClick);
    });
});

function showContent(contentClassName) {
    const contentSections = document.querySelectorAll('.content-container > div');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });

    const selectedContent = document.querySelector(`.${contentClassName}`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
}

function handleMenuItemClick(event) {
    const menuItems = document.querySelectorAll('.sidebar ul li');
    menuItems.forEach(item => {
        item.classList.remove('selected-menu');
    });

    const menuIcons = document.querySelectorAll('.sidebar li i');
    menuIcons.forEach(icon => {
        icon.classList.remove('selected-menu-text');
    });

    const menuTexts = document.querySelectorAll('.sidebar li span');
    menuTexts.forEach(text => {
        text.classList.remove('selected-menu-text');
    });

    const clickedMenuItem = event.currentTarget;
    clickedMenuItem.classList.add('selected-menu');

    const iTag = clickedMenuItem.querySelector('i');
    if (iTag) {
        iTag.classList.add('selected-menu-text');
    }

    const spanText = clickedMenuItem.querySelector('span');
    if (spanText) {
        spanText.classList.add('selected-menu-text');
    }
}
