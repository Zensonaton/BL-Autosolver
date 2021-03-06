const DEBUG = false

/**
 * Finds element by given XPath.
 * @param XPath XPath.
 * @returns HTMLElement.
 */
function getElementByXPath(XPath: string): HTMLElement {
	// @ts-ignore
	return document.evaluate(XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}

/**
 * Waits element to appear.
 * @param elementSelector: string;
 * @param onElementMatch: function;
 * @param context?: HTMLElement;
 * @param stopAfterFindingAny?: boolean;
 * @param throttle?: number;
 */
function waitForElementToAppear(
		elementSelector: string, 
		onElementMatch?: (element: any) => any, 
		context = document.body, 
		stopAfterFindingAny = false, 
		throttle = 300
	) {
	// const matched = new WeakSet()
	let lastCheck = 0
	let checkId: any

	const check = () => {
		// throttle calls
		clearTimeout(checkId)
		const delta = Date.now() - lastCheck
		if (delta < throttle) {
			checkId = setTimeout(check, throttle - delta)
			return
		}
		lastCheck = Date.now()

		var element = document.getElementsByClassName(elementSelector)
		if (element) {
			if (onElementMatch) { onElementMatch(element[0]) }
			if (stopAfterFindingAny) disconnect()
		}
	}

	// observe DOM for changes
	const observer = new MutationObserver(check)
	const connect = () => observer.observe(context, { subtree: true, childList: true })
	const disconnect = () => {
		clearTimeout(checkId)
		observer.disconnect()
	}

	// start waiting
	connect()

	// run initial check in case element is already on the page
	check()

	return { start: connect, stop: disconnect }
}

/**
 * Парсит JWT токен.
 * @param token Строка с JWT токеном.
 * @returns 
 */
function parseJwt(token: string) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(atob(base64).split("").map(function(c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));

    return JSON.parse(jsonPayload);
}

/**
 * Получает ID пользователя билимленда.
 * @returns 
 */
function getUserID(): string {
	return parseJwt(localStorage.getItem("token")!)["sub"]
}

function makeRequest(method: "GET" | "POST", url: string, requestHeaders?: { [key: string]: string }, body?: { [key: string]: any }): Promise<Response> {
	// TODO

    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);

		// Add every request header in requestHeaders
		if (requestHeaders) {
			for (let key in requestHeaders) {
				xhr.setRequestHeader(key, requestHeaders[key])
			}
		}
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };

        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };

		if (body) {
			xhr.send(JSON.stringify(body))
		} else {
			xhr.send()
		}
        
    });
}

// @ts-ignore
var MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

const BILIMLAND_USER_ID = getUserID()

const MODULE_TYPES = [
	"bllp-module-simple",
	"bllp-module-choice",
	"bllp-module-sort",
	"bllp-module-result",
	"bllp-module-expressions",
	"bllp-module-connection",
	"bllp-module-select",
	"bllp-module-markWords",
]

const RUSSIAN_STRINGS = {

	// Zensonaton'ский модуль для хитрожопой работы с билимлендом загружен, ура!
	ScriptLoaded: "Zensonaton\'\u0441\u043A\u0438\u0439 \u043C\u043E\u0434\u0443\u043B\u044C \u0434\u043B\u044F \u0445\u0438\u0442\u0440\u043E\u0436\u043E\u043F\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B \u0441 \u0431\u0438\u043B\u0438\u043C\u043B\u0435\u043D\u0434\u043E\u043C \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D, \u0443\u0440\u0430!",

	// ; ответы (если присутствуют),
	AnswersInnerText: "; \u043E\u0442\u0432\u0435\u0442\u044B (\u0435\u0441\u043B\u0438 \u043F\u0440\u0438\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u044E\u0442),",
	// Если ответы НЕ открываются, то сначала воспользуйся ТГ ботом, и попробуй нажать сюда снова.
	AnswersTitleText: "\u0415\u0441\u043B\u0438 \u043E\u0442\u0432\u0435\u0442\u044B \u041D\u0415 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u044E\u0442\u0441\u044F, \u0442\u043E \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u0432\u043E\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0441\u044F \u0422\u0413 \u0431\u043E\u0442\u043E\u043C, \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u043D\u0430\u0436\u0430\u0442\u044C \u0441\u044E\u0434\u0430 \u0441\u043D\u043E\u0432\u0430.",
	//  скопировать ID вопроса
	ButtonLessonIDString: " \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C ID \u0432\u043E\u043F\u0440\u043E\u0441\u0430",
	// Кнопка для копирования ID вопроса в буфер обмена для быстрого поиска вопроса на сайте с ответами через CTRL+F.
	ButtonLessonIDTitle: "\u041A\u043D\u043E\u043F\u043A\u0430 \u0434\u043B\u044F \u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F ID \u0432\u043E\u043F\u0440\u043E\u0441\u0430 \u0432 \u0431\u0443\u0444\u0435\u0440 \u043E\u0431\u043C\u0435\u043D\u0430 \u0434\u043B\u044F \u0431\u044B\u0441\u0442\u0440\u043E\u0433\u043E \u043F\u043E\u0438\u0441\u043A\u0430 \u0432\u043E\u043F\u0440\u043E\u0441\u0430 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435 \u0441 \u043E\u0442\u0432\u0435\u0442\u0430\u043C\u0438 \u0447\u0435\u0440\u0435\u0437 CTRL+F.",


	// Ошибка при дешифровке.
	DecodeError: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0434\u0435\u0448\u0438\u0444\u0440\u043E\u0432\u043A\u0435.",
	// [скрипт билимленда] Я не смог дешифровать данный урок, поэтому я НЕ буду работать на этой странице.
	DecodeErrorAlert: "[\u0441\u043A\u0440\u0438\u043F\u0442 \u0431\u0438\u043B\u0438\u043C\u043B\u0435\u043D\u0434\u0430] \u042F \u043D\u0435 \u0441\u043C\u043E\u0433 \u0434\u0435\u0448\u0438\u0444\u0440\u043E\u0432\u0430\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0439 \u0443\u0440\u043E\u043A, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u044F \u041D\u0415 \u0431\u0443\u0434\u0443 \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u043D\u0430 \u044D\u0442\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435.",


	// Загружаю урок. URL с расширенной инфой
	DebugLessonLoading: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044E \u0443\u0440\u043E\u043A. URL \u0441 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u043E\u0439 \u0438\u043D\u0444\u043E\u0439",
	// Получаю доступ к index.json...
	DebugGettingAccessToIndexJSON: "\u041F\u043E\u043B\u0443\u0447\u0430\u044E \u0434\u043E\u0441\u0442\u0443\u043F \u043A index.json...",
	// Страница без урока.
	DebugNoLessonPage: "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u0431\u0435\u0437 \u0443\u0440\u043E\u043A\u0430.",
	// Успех, декодирование завершено!
	DebugDecodeComplete: "\u0423\u0441\u043F\u0435\u0445, \u0434\u0435\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E!",
	// ID урока: 
	DebugLessonIDString: "ID \u0443\u0440\u043E\u043A\u0430: ",
	// . Загружаю index.json по ссылке 
	DebugLoadingIndexJSONByUrl: ". \u0417\u0430\u0433\u0440\u0443\u0436\u0430\u044E index.json \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435 ",
	// index.json загружен, декодирую его...
	DebugIndexJSONLoadedSuccessfully: "index.json \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D, \u0434\u0435\u043A\u043E\u0434\u0438\u0440\u0443\u044E \u0435\u0433\u043E...",

	// Скрипт: ожидание урока
	StateWaiting: "\u0421\u043a\u0440\u0438\u043f\u0442\u003a\u0020\u043e\u0436\u0438\u0434\u0430\u043d\u0438\u0435\u0020\u0443\u0440\u043e\u043a\u0430",
	// Скрипт: Страница не с уроком
	StateNoLesson: "\u0421\u043a\u0440\u0438\u043f\u0442\u003a\u0020\u0421\u0442\u0440\u0430\u043d\u0438\u0446\u0430\u0020\u043d\u0435\u0020\u0441\u0020\u0443\u0440\u043e\u043a\u043e\u043c",
	// Скрипт: Гружу инфу о уроке
	StateDownloadingExtInfo: "\u0421\u043a\u0440\u0438\u043f\u0442\u003a\u0020\u0413\u0440\u0443\u0436\u0443\u0020\u0438\u043d\u0444\u0443\u0020\u043e\u0020\u0443\u0440\u043e\u043a\u0435",
	// Скрипт: Получаю доступ к ответам
	StateGettingAccess: "\u0421\u043a\u0440\u0438\u043f\u0442\u003a\u0020\u0413\u0440\u0443\u0436\u0443\u0020\u0438\u043d\u0444\u0443\u0020\u043e\u0020\u0443\u0440\u043e\u043a\u0435",
	// Скрипт: Ответы получены, декодирую
	StateDecodingAnswers: "\u0421\u043a\u0440\u0438\u043f\u0442\u003a\u0020\u041e\u0442\u0432\u0435\u0442\u044b\u0020\u043f\u043e\u043b\u0443\u0447\u0435\u043d\u044b\u002c\u0020\u0434\u0435\u043a\u043e\u0434\u0438\u0440\u0443\u044e",
	// Скрипт: Урок готов, жду заданий
	StateFullyLoaded: "\u0421\u043a\u0440\u0438\u043f\u0442\u003a\u0020\u0423\u0440\u043e\u043a\u0020\u0433\u043e\u0442\u043e\u0432\u002c\u0020\u0436\u0434\u0443\u0020\u0437\u0430\u0434\u0430\u043d\u0438\u0439",
	// Скрипт: ОШИБКА!
	StateError: "\u0421\u043a\u0440\u0438\u043f\u0442\u003a\u0020\u041e\u0428\u0418\u0411\u041a\u0410\u0021",
	// Скрипт: ОК
	StateOK: "\u0421\u043a\u0440\u0438\u043f\u0442\u003a\u0020\u041e\u041a",
	// Скрипт: Неизвестный ex-тип!
	StateUnknownExType: "\u0421\u043a\u0440\u0438\u043f\u0442\u003a\u0020\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439\u0020\u0065\u0078\u002d\u0442\u0438\u043f\u0021",
	// Скрипт: Неизвестный тип задания!
	StateUnknownLessonType: "\u0421\u043a\u0440\u0438\u043f\u0442\u003a\u0020\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u044b\u0439\u0020\u0442\u0438\u043f\u0020\u0437\u0430\u0434\u0430\u043d\u0438\u044f\u0021",


}

const USELESS_MODULE_TYPES = [
	"bllp-module-simple",
	"bllp-module-result",
]

var module_extended_info: { [key: string]: any } = {}
var module_answers: { [key: string]: string } = {}
var module_answers_decoded: { [key: string]: string } = {}

var last_module_id: string

if (DEBUG) { console.clear() } // Не пойму почему настройка для очистки консоли не работала, поэтому будем так извращаться :D

console.log(RUSSIAN_STRINGS.ScriptLoaded)

// Добавляем наш текст состояния скрипта.
const scriptState = document.createElement("span")
// @ts-ignore
scriptState.style = "position: fixed; bottom: 0; right: 0; margin: 15px;"
scriptState.innerText = RUSSIAN_STRINGS.StateWaiting

document.body.appendChild(scriptState)

waitForElementToAppear(
	"ol-week__tab", // <-- один из элементов, который появляется только после появления страницы с уроком.

	(() => {
		try {
			const url = new URL(window.location.href)
			const scheduleID = url.pathname.split("/")[4]
			const AUTHORIZATION_HEADER = { "Authorization": `Bearer ${localStorage.getItem("token")}` }
			
			if (!scheduleID) {
				// Открыта страница не с уроком, поэтому просто выходим.
				console.debug(RUSSIAN_STRINGS.DebugNoLessonPage)
				scriptState.innerText = RUSSIAN_STRINGS.StateNoLesson
	
				return
			}
			
	
			// Проверяем, скачан ли урок или нет:
			if (!(scheduleID in module_extended_info)) {
				// Урок НЕ загружен. Делаем двойную работу, и качаем его снова :(
				const extended_info_url = `https://onlinemektep.net/api/v2/os/schedule/lesson/${scheduleID}`
	
				console.debug(`${RUSSIAN_STRINGS.DebugLessonLoading}: ${extended_info_url}`)
				scriptState.innerText = RUSSIAN_STRINGS.StateDownloadingExtInfo
	
				makeRequest( "GET", extended_info_url, AUTHORIZATION_HEADER ).then((resp: any) => {
					const respObject = JSON.parse(resp).data
					const lessonIntID = respObject.lessonId
					module_extended_info[scheduleID] = respObject
	
					// Инфа о уроке получена, теперь мы можем скачать файл index.json.
					// Однако, что бы быть уверенным в том, что ничего не сломается, мы сначала сделаем дополнительный запрос, без него доступа к файлу с ответами нет.
	
					console.debug(RUSSIAN_STRINGS.DebugGettingAccessToIndexJSON)
					scriptState.innerText = RUSSIAN_STRINGS.StateGettingAccess
	
					makeRequest("POST", "https://onlinemektep.net/api/v2/os/lesson-access", AUTHORIZATION_HEADER, { lessonId: lessonIntID }).then((resp: any) => {
						const lesson_answers_access_token = JSON.parse(resp).data.jwt
						const index_json_url = "https://onlinemektep.net/upload/online_mektep/lesson/" + MD5(MD5("L_" + lessonIntID.toString())) + "/index.json"
	
						console.debug(RUSSIAN_STRINGS.DebugLessonIDString + lessonIntID + RUSSIAN_STRINGS.DebugLoadingIndexJSONByUrl + index_json_url)
		
						makeRequest( "GET", index_json_url, {"secure-token": lesson_answers_access_token} ).then((resp: any) => {
							// index.json загружен!
		
							module_answers[scheduleID] = resp
		
							console.debug(RUSSIAN_STRINGS.DebugIndexJSONLoadedSuccessfully)
							scriptState.innerText = RUSSIAN_STRINGS.StateDecodingAnswers
		
							makeRequest( "POST", "https://bilimlandbot.eu.pythonanywhere.com/api/autocompletion/decode", undefined, {"File": resp, "UID": "not-used"} ).then((resp: any) => {
								// Parsed-результат готов, ура, ликуем!
		
								module_answers_decoded[scheduleID] = JSON.parse(resp)
								console.debug(RUSSIAN_STRINGS.DebugDecodeComplete)
								scriptState.innerText = RUSSIAN_STRINGS.StateFullyLoaded
		
								// Урок загружен, можно продолжать.
								doAutocompletionWork(scheduleID)
							}).catch(() => {
								console.error(RUSSIAN_STRINGS.DecodeError)
								alert(RUSSIAN_STRINGS.DecodeErrorAlert)
							})
						})
					})
				})
			} else {
				// Урок загружен, можно продолжать.
				doAutocompletionWork(scheduleID)
			}	
		} catch (error) {
			console.error(`Bilimland Script error: ${error}`)
			scriptState.innerText = RUSSIAN_STRINGS.StateError
		}
	}),

	document.body,
	false
)

var isNewElementsAdded = false

function doAutocompletionWork(scheduleID: string) {
	const moduleElement = document.getElementsByClassName("bllp-module")[0]

	if (!moduleElement) {
		// Урок ещё не загрузился, ждём...
		scriptState.innerText = "Скрипт: Урок ещё не загрузился"

		return
	}

	const moduleClasslist = moduleElement.classList
	const moduleType = MODULE_TYPES.find(type => moduleClasslist.contains(type))
	const moduleTypeIsUseless = USELESS_MODULE_TYPES.includes(moduleType!)
	const moduleTypeIsUseful = !moduleTypeIsUseless
	const moduleIsChecked = moduleClasslist.contains("bllp-module-checked")

	console.debug(`Module open: ${moduleType}, is it useful for us: ${moduleTypeIsUseful}, is it already completed: ${moduleIsChecked}`)
	if (moduleType === undefined) {
		// Что-то пошло не так.

		console.error("moduleType is undefined!")
		console.debug(moduleClasslist)
		scriptState.innerText = RUSSIAN_STRINGS.StateError
		return
	}

	const moduleID = document.getElementsByClassName("bllp-content")[0].getAttribute("data-con-id")?.substring(0, 36)

	if (moduleTypeIsUseful && last_module_id != moduleID) {
		// Добавляем кое-какие элементы на страницу.

		var answers = document.createElement("a")
		// @ts-ignore
		answers.style = "font-size: 80%; color: blue; cursor: pointer;"
		answers.innerText = RUSSIAN_STRINGS.AnswersInnerText
		answers.title = RUSSIAN_STRINGS.AnswersTitleText
		answers.href = `https://bilimlandbot.eu.pythonanywhere.com/f/?f=${scheduleID}_${getUserID()}.html`
		answers.target = "_blank"

		var lessonID = document.createElement("span")
		// @ts-ignore
		lessonID.style = "font-size: 80%; color: darkorange; cursor: pointer;"
		lessonID.innerText = RUSSIAN_STRINGS.ButtonLessonIDString
		lessonID.title = RUSSIAN_STRINGS.ButtonLessonIDTitle
		lessonID.onclick = (() => {
			const copyElement = document.createElement("textarea"); (copyElement.value = moduleID!); copyElement.setAttribute("readonly", ""); (copyElement.style.position = "absolute");(copyElement.style.left = "-9999px");document.body.appendChild(copyElement);copyElement.select();document.execCommand("copy");document.body.removeChild(copyElement);
			new Audio("https://bilimlandbot.eu.pythonanywhere.com/static/v1.mp3").play()
		})

		document.getElementsByClassName("bllp-title-text")[0].appendChild(answers)
		document.getElementsByClassName("bllp-title-text")[0].appendChild(lessonID)
	
		if (moduleIsChecked) { last_module_id = moduleID! }
	}

	var isSuccess = true

	if (moduleTypeIsUseful && !moduleIsChecked) { // TODO: Не забыть добавить проверку.
		// Мы нашли 'полезный' модуль, т.е., вопрос, на который нужно ответить.

		if (last_module_id == moduleID) {
			// Такой же moduleID, игнорируем.

			return
		}
		last_module_id = moduleID!
		// @ts-ignore
		const module_parsed_answers = module_answers_decoded[scheduleID].data.modules[moduleID!]

		console.debug(`Working with module ID ${moduleID} type ${moduleType}`)
		console.debug(module_parsed_answers)

		switch (moduleType) {
			case ("bllp-module-choice"):
				const isMultiple = module_parsed_answers["isMultiple"]

				var parent = document.getElementsByClassName(isMultiple ? "bllp-cbox-box" : "bllp-mod-choice")[0]

				parent.childNodes.forEach(child => {
					// @ts-ignore
					const dataID = child.getAttribute("data-id")

					if (isMultiple) {
						// Модуль с множественным выбором.

						if (Object.keys(module_parsed_answers["parsedModuleAnswers"]).includes(dataID)) {
							// @ts-ignore
							child.click()
						}
					} else {
						// Модуль с единичным выбором.

						if (dataID == module_parsed_answers["parsedModuleAnswers"]) {
							// @ts-ignore
							child.click()
						}
					}
				})

				break

			case ("bllp-module-connection"):
				const connection_columns = document.getElementsByClassName("bllp-conn-column")
				var parent_left = connection_columns[0]
				var parent_right = connection_columns[1]

				var i = 0
				for (const answer of module_parsed_answers["parsedModuleAnswers"]) {
					setTimeout(() => {
						parent_left.childNodes.forEach(child_left => {
							// @ts-ignore
							const left_children_id = child_left.getAttribute("data-id")
							if (left_children_id == answer["left"]) {
								// @ts-ignore
								child_left.click()

								parent_right.childNodes.forEach(child_right => {
									// @ts-ignore
									const right_children_id = child_right.getAttribute("data-id")

									if (right_children_id == answer["right"]) {
										// @ts-ignore
										child_right.click()
									}

								})
							}
						})
					}, i * 50);

					i += 1
				}

				break

			case ("bllp-module-expressions"):
				// Walk through all HTML elements in moduleElement, and its children.
				// Add an ID number to every occurrence found.
				// Github copilot sucks. D:
				function walk(node: Node, startIndex: number = 0) {
					var i = startIndex

					for (const child of Array.from(node.childNodes)) {
						if (child.nodeType === Node.ELEMENT_NODE) {
							i += 1
							// @ts-ignore
							child.setAttribute("data-ZENSUID", i)

							i = walk(child, i)
						}
					}

					return i
				}

				walk(moduleElement)

				// Function to sort array of HTML elements by their "data-ZENSUID" attribute.
				function _sort(arrayOfHTMLElements: any) {
					return arrayOfHTMLElements.sort((a: any, b: any) => {
						// @ts-ignore
						return parseInt(a.getAttribute("data-ZENSUID")) - parseInt(b.getAttribute("data-ZENSUID"))
					})
				}
				
				

				const all_boxes = _sort([
					...document.querySelectorAll("[data-role=input-expression]"),
					...document.getElementsByClassName("bllx-choice bllp-c-choice")
				])
				console.debug(all_boxes)

				all_boxes.forEach((child: any) => {
					// _moduleSelect()

					if (child.getAttribute("data-role") == "input-expression") {
						// С вводом текста.

						const dataID = child.getAttribute("data-id")

						if (dataID! in module_parsed_answers["parsedModuleAnswers"]) {
							// @ts-ignore
							child.value = module_parsed_answers["parsedModuleAnswers"][dataID]
							child.dispatchEvent(new Event("change"))
						}
					} else if (child.classList.contains("bllp-c-choice")) {
						// С выпадающим списком.
						const answerIndex = all_boxes.indexOf(child)

						_moduleSelect(child, Object.values(module_parsed_answers["parsedModuleAnswers"])[answerIndex] as number)
					} else {
						console.error("Unknown expression type.", child)
						scriptState.innerText = RUSSIAN_STRINGS.StateUnknownExType
						isSuccess = false
					}
				})

				break

			case ("bllp-module-select"):
				var choice_s = getElementByXPath("/html/body/div/div[2]/div/div[4]/div/div[2]/div[1]/div/div/div/div/div/div/div/div[3]/div/div[1]/div[3]/div/div[2]/div")

				// @ts-ignore
				_moduleSelect(choice_s, parseInt(module_parsed_answers["parsedModuleAnswers"]) + 1)

				break

			default:
				console.error(`Module type ${moduleType} is not yet supported!`)
				scriptState.innerText = RUSSIAN_STRINGS.StateUnknownLessonType
				isSuccess = false

				break

		
		}
	}

	if (!moduleIsChecked && isSuccess) {
		scriptState.innerText = RUSSIAN_STRINGS.StateOK
	}
}

function _moduleSelect(choiceBox: any, answer_index: number) {
	choiceBox.firstChild!.click()

	choiceBox.lastChild?.childNodes[answer_index].click()
}
