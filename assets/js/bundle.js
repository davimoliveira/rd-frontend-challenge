(() => {
    const selector = selector => {
        return document.querySelector(selector);
    }
    const create = element => {
        return document.createElement(element);
    }

    const app = selector('#app');

    const Login = create('div');
    Login.classList.add('login');

    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';
    Logo.classList.add('logo');

    const Form = create('form');

    Form.onsubmit = async e => {
        e.preventDefault();

        const [email, password] = e.target.elements;

        const {url} = await fakeAuthenticate(email.value, password.value);

        location.href='#users';
        
        const users = await getDevelopersList(url);
        renderPageUsers(users);
    };

    Form.oninput = e => {
        const [email, password, button] = e.target.parentElement.children;
        (!email.validity.valid || !email.value || password.value.length <= 5) 
            ? button.setAttribute('disabled','disabled')
            : button.removeAttribute('disabled');
    };

    Form.innerHTML = 
    '<input type="text" name="user" value="" class="input" placeholder="Entre com seu e-mail"> '+
    '<input type="password" name="pass" value="" class="input" placeholder="Digite sua senha supersecreta" >'+
    '<button type="submit" name="btGo" class="button" disabled="disabled" > Entrar </button> ';


    app.appendChild(Logo);
    Login.appendChild(Form);

    async function fakeAuthenticate(email, password) {

        var request = new XMLHttpRequest(); 
        request.open("GET", 'http://www.mocky.io/v2/5dba690e3000008c00028eb6',true);
        request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.send();
        var data = JSON.parse(request.responseText);   
        
        const fakeJwtToken = `${btoa(email+password)}.${btoa(data.url)}.${(new Date()).getTime()+300000}`;
        localStorage.setItem('token', fakeJwtToken);

        return data;
    }

    async function getDevelopersList(url) {
        var request = new XMLHttpRequest(); 
        request.open("GET", url ,true);
        request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
        request.setRequestHeader('Access-Control-Allow-Origin', '*');
        request.send();
        var data = JSON.parse(request.responseText);   

        return data;
    }

    function renderPageUsers(users) {
        app.classList.add('logged');
        Login.style.display = "none";
        Logo.style.top = "20px";

        const Ul = create('ul');
        Ul.classList.add('container');

        var list="";
        users.forEach(user => {
            list +='<li><img src="'+user.avatar_url+'" /><span> '+user.login+' </span></li>'
        });

        Ul.innerHTML = list;

        app.appendChild(Ul)
    }


    (async function(){
        const rawToken = localStorage.getItem('token');
        const token = rawToken ? rawToken.split('.') : null
        if (!token || token[2] < (new Date()).getTime()) {
            localStorage.removeItem('token');
            location.href='#login';
            app.appendChild(Login);
        } else {
            location.href='#users';
            const users = await getDevelopersList(atob(token[1]));
            renderPageUsers(users);
        }
    })()
})()