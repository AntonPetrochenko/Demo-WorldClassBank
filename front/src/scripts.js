
var calcLoader
jQuery(() => {
    $(".range-group input[type=range]").get().forEach((range) => {
        range.fancyRange = new FancyRange(range,$($(range).parents()[1]).children('input[type=text]')) //todo: селектор может быть и человеческий
    })
    $('input[name=date]').datepicker({dateFormat: "dd.mm.yy",onSelect: clearInvalid })
    Array.prototype.slice.call(document.forms.calc.elements).forEach((el) => {
        $element = $(el)
        $element.on("input",clearInvalid)
        $element.trigger("input") //костыль для Firefox
    })
    calcLoader = new LoadIndicator($('#calc-loader')[0],500)
})
/**
 * 
 * @param {HTMLFormElement} targetForm 
 */
function validateAndSendCalc(targetForm) {
    var elements = targetForm.elements
    var dto = {}
    //сверху-вниз валидируем все элементы, конвертируем их в простые значения, складываем их в dto...

    //поля должны быть заполнены
    Array.prototype.slice.call(elements).forEach((el) => {
        var errorState
        if (el.value.length < 1) {
            flashInvalid(el)
            errorState = true
        }
        if (errorState) return
    })

    //оставлю этот вариант без автоматической проверки как образец валидации на клиенте

    //присвоению верить
    if (regexMatch = elements.date.value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)) {
        dto.date = {
            day:   +regexMatch[1],   //не забываем, [0] - совпадение целиком
            month: +regexMatch[2],   //заодно переведём в число унарным плюсом
            year:  +regexMatch[3]
        }
    } else {
        flashInvalid(elements.date)
        return
    }

    dto.sumInitial = +elements.sumInitial.value.replace(/\s/g,"")

    dto.term = +elements.term.value

    dto.replinish = elements.replinish.value == "yes"

    if (dto.replinish) {
        dto.sumReplinish = +elements.sumReplinish.value.replace(/\s/g,"")
    } //не будем тратить интернет на отправку ненужных данных
    calcLoader.start()
    console.log(dto)
    $.ajax({
        data: JSON.stringify(dto),
        method: "POST",
        url: "../../back/calc.php",
        dataType: "json",
        contentType: "application/json",
        success: onCalcSuccess,
        error: onCalcError
    })
}

/** @typedef CalcResponseDto
 * @property {Boolean} success Успешен ли был запрос
 * @property {String} humanResponse Строка, пригодная к выводу в span #calc-result
 * @property {Object} additionalData Прочие данные для отладки и тому подобного
*/

/**
 * @param {CalcResponseDto} data 
 */
function onCalcSuccess(data) {
    var resultSpan = $('#calc-result')
    resultSpan.css('color',data.success ? "green":"black")
    resultSpan.text(data.humanResponse)
    calcLoader.stop()
}

function onCalcError(n,m,q) {
    var resultSpan = $('#calc-result')
    resultSpan.css("color","red")
    resultSpan.text("Произошла ошибка. Повторите запрос позже.")
    console.log({n,m,q})
    alert(n.responseText)
    calcLoader.stop()
}

function flashInvalid(el) {
    el.style.backgroundColor = "#FF0000"
    setTimeout(() => {el.style.backgroundColor = "#FF8888"},300)
}

function clearInvalid() {
    this.style.backgroundColor = "white"
}

class FancyRange {
    numberField
    range
    /**
     * @param {HTMLInputElement} target 
     * @param {JQuery<HTMLInputElement>} numberField Да. Это плохо.
     */
    constructor(target,numberField) {
        this.range = target
        this.numberField = numberField
        numberField[0].fancyRange = this
        $(target).on("input change",FancyRange.onRange)
        $(numberField).blur(FancyRange.onNumber)
        $(numberField).on("input",FancyRange.onTextInput)
    }
    static onRange() { //грязнейший хак на диком западе, а также ветвейшие спагетти.... боже, проще было слепить свой input[type=range] на js
        var fancyRange = this.fancyRange
        $(fancyRange.numberField).val(fancyRange.range.value) 
        var divisionPoint = (fancyRange.range.value - fancyRange.range.min*2) / (fancyRange.range.max - fancyRange.range.min) * 0.95 + 0.025
        $(fancyRange.range).css('background-image',
            `
            -webkit-gradient(linear, left top, right top, 
                color-stop(${divisionPoint},#eb5017),
                color-stop(${divisionPoint},#000000)
            )
            ` //-webkit-gradient работает в последней огнелисе
        )
        $(fancyRange.numberField).trigger("input") //обновляем формат поля ввода
    }
    static onNumber() {
        var fancyRange = this.fancyRange
        fancyRange.range.value = +fancyRange.numberField[0].value.replace(/\s/g,"")
        $(fancyRange.range).trigger("input") //обновляем внешний вид ползунка
    }
    static onTextInput() {
        this.value = FancyRange.formatString(this.value)
    }

    static formatString(str) {
        return str.replace(/\s/g,"").replace(/\D(?<=\S)/,"").replace(/^(\d{0,3}?)(\d{0,3}?)(\d{0,3}?)$/g, '$1 $2 $3')
    }
}

class LoadIndicator {
    interval
    target
    msDelay
    currentState = 0
    static states = [".","..","..."]
    static step() {
        this.target.innerText = LoadIndicator.states[this.currentState]
        this.currentState = (this.currentState+1)%3
    }
    start() {
        this.interval = setInterval(LoadIndicator.step.bind(this),this.msDelay)
        //без bind в step() this будет Window даже без static
    }
    stop() {
        clearInterval(this.interval)
        this.target.innerText = ""
    }
    constructor(target,msDelay) {
        this.target = target
        this.msDelay = msDelay
    }
}