+'use strict';

let btn = document.querySelector('.addbutton');
let list = document.querySelector('.list');
let inter = document.querySelector('.interface');
let head = window.document.getElementsByTagName('head')[0]

let btnCoords = btn.getBoundingClientRect();
btn.style.top = (document.documentElement.clientHeight / 100 * 80 ) + 'px';
btn.style.left = (document.documentElement.clientWidth / 2) - btnCoords.width/2 + 'px'

// window.addEventListener('DOMContentLoaded',function(event){
//     btn.style.display = 'inline-block';
// })

function loadTheme(href){
    let style = window.document.createElement('link'); 
    style.href = href; 
    style.rel = 'stylesheet';
    head.appendChild(style)
}

function getTime(){
    let date = new Date();

    let mon = date.getMonth()+1;
    let day = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();

    if(mon<10){
        mon = '0'+mon;
    }

    if(day<10){
        day = '0'+day;
    }

    if(h<10){
        h = '0'+h;
    }

    if(m<10){
        m = '0'+m;
    }

    let line = day+'.'+mon+' '+h+':'+m;

    console.log(line);
    return line;
}

function localLoad(){
    for(let i = 0 ; i<localStorage.length;i++){
        let x = localStorage.getItem(i);
        let content = null;
        
        if(x[x.length-1]=='~'){
            content = x.slice(0,x.length-1);
        }

        else{
            content=x;
        }
        let div = content.indexOf('/');
        let text = content.slice(0,div);
        let tinfo = content.slice(div+1,content.length);
        console.log(text,tinfo);

        let noteSpace = document.createElement('div');
        noteSpace.className = 'note__space';

        let note = undefined;
        if(x[x.length-1]=='~'){
            note = document.createElement('div')
            note.className = 'note__field_checked';
            note.classList.add('note');
        }

        else{
        note = document.createElement('div')
        note.className = 'note__field';
        note.classList.add('note');
        }

        let control = document.createElement('div');
        control.className = 'control__field';

        let check = undefined;
        if(x[x.length-1]=='~'){
            check = document.createElement('input');
            check.className = 'note__check';
            check.setAttribute('type','checkbox');
            check.checked=true;
        }

        else{
        check = document.createElement('input');
        check.className = 'note__check';
        check.setAttribute('type','checkbox');
        check.checked=false;
        }


        let remBtn = document.createElement('button');
        remBtn.className = 'button__remove';

        let info = document.createElement('p');
        info.className = 'note__info';

        let time = document.createElement('p');
        time.className = 'note__time';

        list.append(noteSpace);
        noteSpace.append(note);
        note.append(info)

        info.textContent = text;
        time.textContent = tinfo;
        note.append(control);
        control.append(check);
        control.append(remBtn);
        noteSpace.append(time);
        remBtn.addEventListener('click',remNote);
        btn.addEventListener('click',inputNote);
    }
}

localLoad();

function remNote(event){
    let idx = null;
    let note = event.target.closest('.note');
    let listChildes =  list.children;
    console.log(listChildes);
    for(let i = 0 ; i<listChildes.length; i++){
        if(listChildes[i].children[0]==note){
            console.log(i);
            idx = i;
        }
    }
    listChildes[idx].remove();
    localStorage.removeItem(idx);

    let val = null;
    let j = idx;

    if(j==localStorage.length-1){
        val = localStorage.getItem(j+1);
        localStorage.setItem(j,val);
        localStorage.removeItem((localStorage.length)-1);
    }

    else if(j<localStorage.length-1){
    for(let i = idx ; i<localStorage.length-1 ; i++){
        // console.log('YES');
        val = localStorage.getItem(i+1);
        localStorage.setItem(i,val);
    }
    localStorage.removeItem((localStorage.length)-1);
    }
}    


function addNote(event){
    // console.log(event.target.value);
    // console.log(event.target);
        let ctime = getTime();
        let content = event.target.value;

        let noteSpace = document.createElement('div');
        noteSpace.className = 'note__space';

        let note = document.createElement('div')
        note.className = 'note__field';
        note.classList.add('note');
        
        let control = document.createElement('div');
        control.className = 'control__field';

        let check = document.createElement('input');
        check.className = 'note__check';
        check.setAttribute('type','checkbox');
        check.checked=false;

        let remBtn = document.createElement('button');
        remBtn.className = 'button__remove';

        let info = document.createElement('p');
        info.className = 'note__info';

        let time = document.createElement('p');
        time.className = 'note__time';

        event.target.remove();
        list.append(noteSpace);
        noteSpace.append(note);
        note.append(info)

        let storageField = content+'/'+ctime;
        localStorage.setItem(list.querySelectorAll('.note').length-1, storageField);
        info.textContent = content;
        time.textContent = ctime;
        note.append(control);
        control.append(check);
        control.append(remBtn);
        noteSpace.append(time); //*
        remBtn.addEventListener('click',remNote);
        btn.addEventListener('click',inputNote);
}

function inputNote(event){

    if(list.querySelectorAll('.note').length<=14){
    btn.removeEventListener('click',inputNote);

    let input = document.createElement('textarea');
    input.className = 'input__field';
    input.style.position='absolute';
    input.style.zIndex=5;

    inter.append(input);

    input.style.left = window.pageXOffset + document.documentElement.clientWidth/2 - input.clientWidth/2 +'px';
    input.style.top = window.pageYOffset + document.documentElement.clientHeight/2 - input.clientHeight/2 +'px';

    // console.log(input);
    input.onkeydown = function(event){
        if(event.code == 'Backquote' || event.code == 'Slash'){
            return false;
        }

        else if(event.code === 'Enter'){
            event.target.blur();
        }

        else if(event.code !='Backspace'){
        return input.value.length < 200;
        }
    };

    input.addEventListener('change',addNote);
    }
}

function noteChecker(event){
    if(event.target.closest('.note__check')){
        if(event.target.checked){
        event.target.checked = 'true';
        event.target.closest('.note__field').className = 'note__field_checked';
        event.target.closest('.note__field_checked').classList.add('note');

        let idx = null;
        let note = event.target.closest('.note');
        let listChildes =  list.children;
        console.log(listChildes);
        for(let i = 0 ; i<listChildes.length; i++){
            if(listChildes[i].children[0]==note){
                console.log(i);
                idx = i;
            }
        }

        let val = localStorage.getItem(idx);
        val+='~';
        console.log(val);
        localStorage.setItem(idx,val);
        }

        else{
            event.target.checked = '';
            event.target.closest('.note__field_checked').className = 'note__field';
            event.target.closest('.note__field').classList.add('note');

            let idx = null;
            let note = event.target.closest('.note');
            let listChildes =  list.children;
            // console.log(listChildes);
            for(let i = 0 ; i<listChildes.length; i++){
                if(listChildes[i].children[0]==note){
                    console.log(i);
                    idx = i;
                }
            }

            let val = localStorage.getItem(idx);
            val = val.slice(0,val.length-1);
            console.log(val);
            localStorage.setItem(idx,val);
        }
    }
}

btn.addEventListener('click',inputNote);
list.addEventListener('click',noteChecker);

let current = undefined;

document.ondragstart = function() {
    return false;
};

