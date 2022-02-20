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

// Function to walk in nested HTML Element children, to find element with data-role attribute.
function findElementWithDataRole(element: HTMLElement, dataRole: string): any {
	if (element.hasAttribute("data-role") && element.getAttribute("data-role") === dataRole) {
		return element
	}

	for (let i = 0; i < element.children.length; i++) {
		// @ts-ignore
		let result = findElementWithDataRole(element.children[i], dataRole)
		if (result) return result
	}
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

const USELESS_MODULE_TYPES = [
	"bllp-module-simple",
	"bllp-module-result",
]

var module_extended_info: { [key: string]: any } = {}
var module_answers: { [key: string]: string } = {}
var module_answers_decoded: { [key: string]: string } = {}

var last_module_id: string

if (DEBUG) { console.clear() } // Не пойму почему настройка для очистки консоли не работала, поэтому будем так извращаться :D

console.log("Zensonaton'ский модуль для хитрожопой работы с билимлендом загружен, ура!")

waitForElementToAppear(
	"bllp-module",
	((element) => {
		const url = new URL(window.location.href)
		const scheduleID = url.pathname.split("/")[4]

		// Проверяем, скачан ли урок или нет:
		if (!(scheduleID in module_extended_info)) {
			// Урок НЕ загружен. Делаем двойную работу, и качаем его снова :(
			const extended_info_url = `https://onlinemektep.net/api/v2/os/schedule/lesson/${scheduleID}`

			console.debug(`Загружаю урок. URL с расширенной инфой: ${extended_info_url}`)

			makeRequest( "GET", extended_info_url, { "Authorization": `Bearer ${localStorage.getItem("token")}` } ).then((resp: any) => {
				const respObject = JSON.parse(resp).data
				const lessonIntID = respObject.lessonId
				module_extended_info[scheduleID] = respObject

				// Инфа о уроке получена, теперь мы можем скачать файл index.json.

				const index_json_url = "https://onlinemektep.net/upload/online_mektep/lesson/" + MD5(MD5("L_" + lessonIntID.toString())) + "/index.json"

				console.debug("ID урока: " + lessonIntID + ". Загружаю index.json по ссылке " + index_json_url)

				makeRequest( "GET", index_json_url ).then((resp: any) => {
					// index.json загружен!

					module_answers[scheduleID] = resp

					console.debug("index.json загружен, декодирую его...")

					makeRequest( "POST", "https://bilimlandbot.eu.pythonanywhere.com/api/autocompletion/decode", undefined, {"File": resp, "UID": "123123123"} ).then((resp: any) => {
						// Parsed-результат готов, ура, ликуем!

						module_answers_decoded[scheduleID] = JSON.parse(resp)
						console.debug("Успех, декодирование завершено!")
					}).catch((err) => {
						console.error("Ошибка при дешифровке.")
						alert("[скрипт билимленда] Я не смог дешифровать данный урок, поэтому я НЕ буду работать на этой странице.")
					})
				})
			})
		}

		const moduleClasslist = element.classList
		const moduleType = MODULE_TYPES.find(type => moduleClasslist.contains(type))
		const moduleTypeIsUseless = USELESS_MODULE_TYPES.includes(moduleType!)
		const moduleTypeIsUseful = !moduleTypeIsUseless
		const moduleIsChecked = moduleClasslist.contains("bllp-module-checked")

		console.debug(`Открыт модуль ${moduleType}, полезен ли он: ${moduleTypeIsUseful}, чекнутый: ${moduleIsChecked}`)
		if (moduleType === undefined) {
			// Что-то пошло не так.

			console.error("moduleType is undefined!")
			console.debug(moduleClasslist)
			return
		}

		if (moduleTypeIsUseful && !moduleIsChecked) { // TODO: Не забыть добавить проверку.
			// Мы нашли 'полезный' модуль, т.е., вопрос, на который нужно ответить.

			const moduleID = getElementByXPath("/html/body/div/div[2]/div/div[4]/div/div[2]/div[1]/div/div/div/div/div/div/div/div[3]/div/div[1]/div[3]/div/div[1]").getAttribute("data-con-id")?.substring(0, 36)
			if (last_module_id == moduleID) {
				// Такой же moduleID, игнорируем.

				return
			}
			last_module_id = moduleID!
			// @ts-ignore
			const module_parsed_answers = module_answers_decoded[scheduleID].data.modules[moduleID!]

			console.debug(`Работаю над модулем с ID ${moduleID}, типа ${moduleType}`)
			// console.debug(module_parsed_answers)

			switch (moduleType) {
				case ("bllp-module-choice"):
					var parent = getElementByXPath(`/html/body/div/div[2]/div/div[4]/div/div[2]/div[1]/div/div/div/div/div/div/div/div[3]/div/div[1]/div[3]/div/div[${module_parsed_answers["isMultiple"] ? 3 : 2}]`)

					parent.childNodes.forEach(child => {
						// @ts-ignore
						const dataID = child.getAttribute("data-id")

						if (module_parsed_answers["isMultiple"]) {
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
					var parent_left = getElementByXPath("/html/body/div/div[2]/div/div[4]/div/div[2]/div[1]/div/div/div/div/div/div/div/div[3]/div/div[1]/div[3]/div/div[3]/ul[1]")
					var parent_right = getElementByXPath("/html/body/div/div[2]/div/div[4]/div/div[2]/div[1]/div/div/div/div/div/div/div/div[3]/div/div[1]/div[3]/div/div[3]/ul[2]")

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
					var parent = getElementByXPath("/html/body/div/div[2]/div/div[4]/div/div[2]/div[1]/div/div/div/div/div/div/div/div[3]/div/div[1]/div[3]/div/div")

					var i = 0
					parent.childNodes.forEach((child) => {
						child.childNodes.forEach((child_2) => {
							// @ts-ignore
							const classList = child_2.classList

							// for (let i = 0; i < classList.length; i++) {
							classList.forEach((className: string) => {
								if (className.startsWith("bllx-")) {
									if (className === "bllx-input-wrapper") {
										// @ts-ignore
										const element = findElementWithDataRole(parent, "input-expression")
										element.value = module_parsed_answers["parsedModuleAnswers"][element.getAttribute("data-id")]
										element.dispatchEvent(new Event("change"))
									} else if (className === "bllx-choice") {
										const right_answer_id = Object.values(module_parsed_answers["parsedModuleAnswers"])[i]

										// @ts-ignore
										child_2.firstChild?.firstChild?.click()
										// @ts-ignore
										child_2.lastChild?.childNodes[parseInt(right_answer_id)].click()
										
										i += 1
									} else {
										console.error("Неизвестный тип: " + className)
									}
								}
							})
						})
					})

					break

				case ("bllp-module-select"):
					const choice = getElementByXPath("/html/body/div/div[2]/div/div[4]/div/div[2]/div[1]/div/div/div/div/div/div/div/div[3]/div/div[1]/div[3]/div/div[2]/div")


					// @ts-ignore
					choice.firstChild.click()

					// @ts-ignore
					choice.lastChild?.childNodes[parseInt(module_parsed_answers["parsedModuleAnswers"]) + 1].click()


					break

				default:
					console.error(`Тип ${moduleType} не поддерживается!`)

					break
			}
		}
	}),
	document.body,
	false
)
