const tagContainer = document.querySelector('.tag-container');
const tagInput = document.querySelector('input.tags-input');
const tagValue = document.querySelector('input.tags-value');

let tags = [''];

function createTag(label) {
    const div = document.createElement('div');
    div.setAttribute('class', 'tag');
    const span = document.createElement('span');
    span.innerHTML = label;
    const closeIcon = document.createElement('i');
    closeIcon.setAttribute('class', 'fa fa-close');
    closeIcon.setAttribute('data-item', label);
    div.appendChild(span);
    div.appendChild(closeIcon);
    return div;
}

function clearTags() {
    document.querySelectorAll('.tag').forEach(tag => {
        tag.parentElement.removeChild(tag);
    });
}

function addTags() {
    clearTags();

    tags.slice().reverse().forEach(tag => {
        if (tags.indexOf(tag) != 0) {
            tagContainer.prepend(createTag(tag));
        }
    });
}

function addValueInputValue() {
    let arrayInput = [];

    for (var i = 0; i < tags.length; i++) {
        if (tags[i] != '')
            arrayInput.push(tags[i]);
    }

    tagValue.value = arrayInput.toString();
}

tagInput.addEventListener('keyup', (e) => {
    switch (tagInput.getAttribute('tag-type')) {
        case 'only-number':
            tagInput.value = tagInput.value.match(/[0-9]*/);
            break;
    }
    
    if (e.key != 'Delete') {
        if (tags.length <= tagInput.getAttribute('tag-length')) {
            if (e.key === 'Enter' || e.key === ',') {
                if (tags[0] != '') {
                    if (tags.length === 1) {
                        tagValue.placeholder = tagInput.placeholder;
                        tagInput.placeholder = '';
                    }

                    tags[0].split(',').forEach(tag => {
                        tags.push(tag);
                    });

                    tags[0] = '';
                    tagInput.value = '';
                    addTags();
                }
            } else {
                tags[0] = tagInput.value;
            }
        }
    } else {
        tagInput.value = '';
        tags = ['']
        addTags();
        tagInput.placeholder = tagValue.placeholder;
        tagValue.placeholder = '';
    }

    addValueInputValue();
});

tagInput.addEventListener('paste', (e) => {
    let paste = (event.clipboardData || window.clipboardData).getData('text');

    let arrayPaste = []

    switch (tagInput.getAttribute('tag-type')) {
        case 'only-number':
            paste.toString().split(',').forEach(p => {
                let pasteReg = p.match(/[0-9]*/);
                if (pasteReg != '') {
                    arrayPaste.push(pasteReg);
                }
            });
            break;
    }

    if (tags.length <= tagInput.getAttribute('tag-length')) {
        let rest = parseInt(tagInput.getAttribute('tag-length')) - tags.length;

        let arrayRest = arrayPaste;

        if (rest < arrayPaste.length) {
            arrayRest = [...arrayPaste.slice(0, rest+1)];
        }

        if (arrayRest.length > 0) {
            if (tags.length === 1) {
                tagValue.placeholder = tagInput.placeholder;
                tagInput.placeholder = '';
            }
            arrayRest.forEach(item => {
                tags.push(item.toString());
            });
            addTags();
        }
    }

    addValueInputValue();
});

document.addEventListener('click', (e) => {
    if (e.target.tagName === 'I') {
        const tagLabel = e.target.getAttribute('data-item');
        const index = tags.indexOf(tagLabel);
        tags = [...tags.slice(0, index), ...tags.slice(index + 1, tags.length)];
        addTags();

        if (tags.length === 1) {
            tagInput.placeholder = tagValue.placeholder;
            tagValue.placeholder = '';
        }

        addValueInputValue();
    }
});