//Instagram APP

//Variavéis
/*
    clientId => Usar o MESMO 'clientID' definido nas configurações 
                do seu cleinte na API do Instagram. 
    clientSecret => Usar o MESMO 'clientSecret' definido nas configurações 
                do seu cleinte na API do Instagram. 
    redirectUri => Usar a MESMA uri de redirecionamento definida nas configurações 
                do seu cleinte na API do Instagram. 
    grantType => Definido na API do instagram como 'authorization_code'
    urlValue => Obtém, após '?', todos os parametros usados na url.
    statusRequest => Armazena um objeto que retorna 
                da requisição feita na API do Instagram para obtenção do 'access_token'.  
*/

var accessToken = "";
var code = "";
var clientId = "";
var clientSecret = "";
var redirectUri = "";
var grantType = "authorization_code";
var urlValue = window.location.search.substring(1);
var statusRequest = {};

//Funções
/*
    Irá redirecionar o usuário para o link de autenticação do Instagram API, a fim que
    o mesmo efetua o login e autorize, ou não, o app para ter acesso aos seus dados 
    da sua conta do Instagram.
*/
function directUserForAuthUrl(){
    window.location = "https://api.instagram.com/oauth/authorize/?client_id="
                      +clientId+"&redirect_uri="+redirectUri+"&response_type=code&hl=en";
}

/*
    Função que será chamada caso a requisição para obter o 'access_token'
    retornar o código do 'access_token'. 
*/
function callbackAuthUserSuccess(responseToken){
    accessToken = responseToken.access_token;
    
    /*
        Gera um número aleatório que irá compor o nome da função de 'callback'
        para obtenção dos dados pessoais do próprietário da conta do Instagram.
    */
    cbIgUserFuncNum = Math.round(100000 * (Math.random() + 0.1));
    cbIgUserFuncName = "cb_" + cbIgUserFuncNum;
    window[cbIgUserFuncName] = function(responseDataUser){
        /*
            Aqui será feito a manipulação do 'DOM' para mostrar
            os dados pessoais do próprietário da conta do Instagram.
        */
        console.log(responseDataUser);
    }

    /*
        Gera um número aleatório que irá compor o nome da função de 'callback'
        para obtenção dos posts do próprietário da conta do Instagram.
    */
    cbIgUserCommentFuncNum = Math.round(100000 * (Math.random() + 0.1));
    cbIgUserCommentFuncName = "cb_" + cbIgUserCommentFuncNum;
    window[cbIgUserCommentFuncName] = function(responseDataUserComment){
        /*
            Aqui será feito a manipulação do 'DOM' para mostrar
            os posts do próprietário da conta do Instagram.
        */
        console.log(responseDataUserComment);
    }

    /*
        Requisição feita para obteção dos dados pessoais do próprietário da
        conta do Instagram.
    */
    scIgUserToken = document.createElement("script");
    scIgUserToken.setAttribute("src", "https://api.instagram.com/v1/users/self/?access_token="
                               +accessToken+"&callback=cb_"+cbIgUserFuncNum);
    document.body.appendChild(scIgUserToken);

    /*
        Requisição feita para obteção dos posts do próprietário da conta
        do Instagram.
    */
    scIgUserCommentToken = document.createElement("script");
    scIgUserCommentToken.setAttribute("src", "https://api.instagram.com/v1/users/self/media/recent/?access_token="
                                      +accessToken+"&callback=cb_"+cbIgUserCommentFuncNum);
    document.body.appendChild(scIgUserCommentToken);

    statusRequest = responseToken;
}

/*
    Função que será chamada caso a requisição para obter o 'access_token'
    retornar erro. 
*/
function callbackAuthUserError(jqXHR, exception){
    statusRequest.jqXHR = jqXHR;
    statusRequest.exception = exception;
}

/* 
    Função 'core' responsável por iniciar a aplicação. 
*/
function getAuthUser(){
    /* 
        Expressão regular irá verificar se no redirecionamento da url
        tem um parametro com o nome de 'error'.
    */
    if(/(?=\&)*error(?=\=)/g.test(urlValue)){
        /*
            Trata o erro quando o usuário negar
            a aplicação de acessar seus dados ou por
            algum outro conflito de 'redirect_uri'
        */
    }
    else{
        code = urlValue.replace("code=",'');
        $.ajax({
            method: 'POST',
            url: 'https://api.instagram.com/oauth/access_token',
            data: {
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: grantType,
                code: code,
                redirect_uri: redirectUri,
            },
            success: callbackAuthUserSuccess,
            error: callbackAuthUserError
        });
    }
}