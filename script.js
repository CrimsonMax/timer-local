const timerVariables = {
    active: false,
    title: 'Новый таймер',
    documentTitle: 'ТАЙМЕР',
    ownerName: 'Maxim',
    ownerSurname: 'Klimenok',
    interval: null,
    initialMinutes: '05',
    initialSeconds: '00',
    initialLength: null,
    lineWidth: 100,
    addOneVal: 1,
    addFiveVal: 5,
    addOneText: '+1 мин',
    addFiveText: '+5 мин',
    clickTimesMinutes: 0,
    clickTimesSeconds: 0,
    keyDownBtns: [],
    keyActions: {
        'Tab': 'tab',
        'Delete': 'del',
        'Backspace': 'back',
        'Enter': 'enter',
        'Escape': 'escape',
    },
}

function timerMainContainer() {
    const template = $(`
      <div class="dashboard-timer-container">
          <div class="dashboard-timer-container__wrapper">
              <div class="dashboard-timer-display">
                  <div class="dashboard-timer-display__counter dashboard-clock-counter">

                      <div class="dashboard-clock-counter__container">
                          <div class="dashboard-clock-counter__background">
                              <span class="dashboard-clock-counter__fake">88</span>
                              <span class="dashboard-timer-colon">:</span>
                              <span class="dashboard-clock-counter__fake">88</span>
                          </div>
                          <div class="dashboard-clock-counter__foreground">
                              <input type="number" min="-1" max="100" step="1" inputmode="numeric" class="dashboard-clock-counter__input dashboard-clock-counter__input--counter-minutes" id="timer-minutes" value=${timerVariables.initialMinutes}>
                              <span class="dashboard-timer-colon">:</span>
                              <input type="number" min="-1" max="60" step="1" inputmode="numeric" class="dashboard-clock-counter__input dashboard-clock-counter__input--counter-seconds" id="timer-seconds" value=${timerVariables.initialSeconds}>
                          </div>
                      </div>

                  </div>
                  
                  <div class="dashboard-timer-display__info">${timerVariables.title}</div>

                  <div class="dashboard-timer-display__progress-container">
                      <div class="dashboard-timer-display__progress-bar dashboard-timer-display__progress-bar--hidden"></div>
                  </div>

                  <div class="dashboard-timer-display__hide-button pruffme_button small ghost"></div>
              </div>
          </div>
      </div>
  `)

    return template
}

function dashboardTimerControl() {
    const template = $(`
      <div class="dashboard-timer-control">

          <div class="dashboard-timer-control__block">
              <button class="dashboard-timer-control__button dashboard-timer-control__button--one pruffme_button small secondary" tabindex="-1">${timerVariables.addOneText}</button>
              <button class="dashboard-timer-control__button dashboard-timer-control__button--five pruffme_button small secondary" tabindex="-1">${timerVariables.addFiveText}</button>
          </div>
          <div class="dashboard-timer-control__block">
              <button class="dashboard-timer-control__button dashboard-timer-control__button--stop pruffme_button small outline" id="timer-stop" tabindex="-1"></button>
              <button class="dashboard-timer-control__button dashboard-timer-control__button-action dashboard-timer-control__button--play pruffme_button small" id="timer-play" tabindex="-1"></button>
          </div>

      </div>
  `)

    return template
}

function dashboardTimerMiniCounter() {
    const template = $(`
      <div class="dashboard-clock-counter__background dashboard-clock-counter__background--hide" id="mini-timer">
          <span class="dashboard-clock-counter__fake dashboard-clock-counter__fake--hide dashboard-clock-counter__fake--minutes js-mini-minutes" id"mini-minutes">${timerVariables.initialMinutes}</span>
          <span class="dashboard-timer-colon dashboard-timer-colon--hide">:</span>
          <span class="dashboard-clock-counter__fake dashboard-clock-counter__fake--hide dashboard-clock-counter__fake--seconds js-mini-seconds" id="mini-seconds">${timerVariables.initialSeconds}</span>
      </div>
  `)

    return template
}

function timerAddMinutes(minutes) {
    if (isNaN(minutes)) return

    const $containerMinutes = $('#timer-minutes')

    let minutesValue = $containerMinutes.prop('value').slice(-2)
    const maxValue = $containerMinutes.attr('max') - 1

    if (+minutesValue === maxValue) {
        return
    }

    if (minutesValue < maxValue - minutes) {
        minutesValue = +minutesValue + minutes
    } else {
        minutesValue = maxValue
    }

    if ($containerMinutes.prop('value').charAt(0) !== 0) {
        $containerMinutes.prop('value', minutesValue.toString().padStart(2, '0'))
    }

    $containerMinutes.attr("value", minutesValue);

    if (timerVariables.title === `${timerVariables.ownerName} ${timerVariables.ownerSurname}`) {
        // добавляем минуты уже запущенному таймеру

        let minutesLength = $('#timer-minutes').prop('value')
        let secondsLength = $('#timer-seconds').prop('value')

        clearInterval(timerVariables.interval)

        $('.dashboard-timer-display__progress-bar').css('width', '100%')

        timerVariables.lineWidth = 100

        dashboardTimer(minutesLength, secondsLength)
    }

    let newInitial = +timerVariables.initialMinutes + minutes

    if (newInitial < 10) {
        timerVariables.initialMinutes = '0' + newInitial
    } else if (newInitial > 99) {
        timerVariables.initialMinutes = '99'
    } else {
        timerVariables.initialMinutes = newInitial
    }

    $('.dashboard-clock-counter__foreground, .dashboard-tools-timer').removeClass('timer-ending')

    checkNoValue()
}

function hideTimer() {
    const $container = dashboardTimerMiniCounter()

    $('.dashboard-tracking-list-container--landing').removeClass('dashboard-tracking-list-container--timer')

    let valueMinutes = $('#timer-minutes').val()
    let valueSeconds = $('#timer-seconds').val()

    $('.dashboard-tools-timer').removeClass('dashboard-tools-timer--timer-active')
    $('.dashboard-tools-timer').addClass('dashboard-tools-timer--active-count')

    $('.dashboard-timer-container').addClass('dashboard-timer-container--hide-timer')
    $('.dashboard-tool-timer-count').append($container)

    $('.js-mini-minutes').text(valueMinutes)
    $('.js-mini-seconds').text(valueSeconds)

    $('.dashboard-tool-timer-count').addClass('dashboard-tool-timer-count--show-timer')

    if ($('.dashboard-clock-counter__container').hasClass('dashboard-clock-counter__container--paused')) {
        $('.dashboard-tool-timer-count').addClass('dashboard-tool-timer-count--timer-paused')
    }
}

function removeTimer() {
    $('.dashboard-tools-timer').removeClass('dashboard-tools-timer--timer-active')

    $('.dashboard-tracking-list-container--landing').removeClass('dashboard-tracking-list-container--timer')

    timerVariables.initialMinutes = $('#timer-minutes').val()
    timerVariables.initialSeconds = $('#timer-seconds').val()

    $('.dashboard-timer-container').remove()
}

function removeMiniTimer() {
    $('#mini-timer').remove()
    $('.dashboard-tool-timer-count').removeClass('dashboard-tool-timer-count--show-timer dashboard-tool-timer-count--timer-paused')
    $('.dashboard-timer-container').removeClass('dashboard-timer-container--hide-timer')

    $('.dashboard-tools-timer').removeClass('dashboard-tools-timer--active-count')
    $('.dashboard-tools-timer').addClass('dashboard-tools-timer--timer-active')
}

function checkNoValue() {
    let minutesLength = $('#timer-minutes').prop('value')
    let secondsLength = $('#timer-seconds').prop('value')

    if (+minutesLength + +secondsLength === 0) {
        return $('#timer-play').prop('disabled', true)
    } else {
        return $('#timer-play').prop('disabled', false)
    }
}

function checkMultipleBtns(key) {
    timerVariables.keyDownBtns = timerVariables.keyDownBtns.filter((elem) => elem !== key)

    if (timerVariables.keyDownBtns.length > 0) {
        return true
    } else {
        return false
    }
}

function inputHandler(context) {
    let inputValue = $(context).prop('value').slice(-2) // последние две введённые цифры
    const maxValue = $(context).attr('max') - 1 // макс вэлью больше на один, что бы обработать цикличность при вводе колесом мыши

    if (inputValue < 0) {
        $(context).prop('value', maxValue === 99 ? '99' : '59')
        checkNoValue()

        return
    }
    if (inputValue > maxValue) {
        $(context).prop('value', '00')
        checkNoValue()

        return
    }

    if ($(context).prop('value').charAt(0) !== 0) {
        $(context).prop('value', inputValue.padStart(2, '0'))
    } // добавляем ноль перед однозначными цифрами

    $(context).attr("value", inputValue)

    checkNoValue()
}

function keyDownHandler(context, event, minutes) {
    timerVariables.keyDownBtns.length = 0
    timerVariables.keyDownBtns.push(event.key)

    let clickCount = minutes ? timerVariables.clickTimesMinutes : timerVariables.clickTimesSeconds

    if (clickCount === 0 && !timerVariables.keyActions.hasOwnProperty(event.key)) {
        $(context).prop('value', '00')

        checkNoValue()
    } // сбрасываем вэлью в ноль при вводе, что бы обработать любое положение каретки
}

function keyUpHandler(context, event, minutes) {
    if (checkMultipleBtns(event.key)) {
        return
    }

    if (!/^[0-9]$/i.test(event.key) && !timerVariables.keyActions.hasOwnProperty(event.key)) {
        minutes ? timerVariables.clickTimesMinutes = 0 : timerVariables.clickTimesSeconds = 0

        $(context).blur()

        return
    }

    if (event.key === 'Tab') return

    if (event.key === 'Delete') {
        return minutes ? timerVariables.clickTimesMinutes = 0 : timerVariables.clickTimesSeconds = 0
    }

    let clickCount = minutes ? timerVariables.clickTimesMinutes : timerVariables.clickTimesSeconds

    if (clickCount < 1 && event.key !== 'Backspace' && event.key !== 'Escape') {
        minutes ? timerVariables.clickTimesMinutes++ : timerVariables.clickTimesSeconds++
    } else {
        minutes ? timerVariables.clickTimesMinutes = 0 : timerVariables.clickTimesSeconds = 0

        if (event.key === 'Backspace') {
            return
        }

        if (event.key === 'Escape') {
            return $(context).blur()
        }

        if (minutes) {
            $(context).nextAll('#timer-seconds').focus()
            $('#timer-seconds').select()
        } else {
            $(context).blur()
        }
    }
}

function stopClickHandler({ $actionButton, $progressBar, $counterContainer, $displayCounter, $stopButton, $topTimerContainer }) {
    timerVariables.title = 'Новый таймер'

    if ($actionButton.hasClass('dashboard-timer-control__button--pause')) {
        // если таймер запущен

        $actionButton.removeClass('dashboard-timer-control__button--pause outline')
        $actionButton.addClass('dashboard-timer-control__button--play')
    } else {
        // когда таймер на паузе

        $progressBar.removeClass('dashboard-timer-display__progress-bar--stopped dashboard-clock-counter__container--paused')
        $counterContainer.removeClass('dashboard-clock-counter__container--paused')
    }

    $progressBar.addClass('dashboard-timer-display__progress-bar--hidden')
    $displayCounter.removeClass('dashboard-clock-counter--counter-blocked')

    $stopButton.hide()

    $topTimerContainer.find('.dashboard-timer-display__info').text(timerVariables.title)

    clearInterval(timerVariables.interval)

    $('.dashboard-clock-counter__foreground, .dashboard-tools-timer').removeClass('timer-ending')
    $progressBar.css('width', '100%')

    timerVariables.active = false
    timerVariables.lineWidth = 100
    timerVariables.interval = null

    document.title = `${timerVariables.documentTitle}`

    $('#timer-minutes').prop('value', timerVariables.initialMinutes)
    $('#timer-seconds').prop('value', timerVariables.initialSeconds)
}

function actionClickHandler({ $actionButton, $progressBar, $counterContainer, $displayCounter, $stopButton, $topTimerContainer }) {
    let minutesLength = $('#timer-minutes').prop('value')
    let secondsLength = $('#timer-seconds').prop('value')

    if ($actionButton.hasClass('dashboard-timer-control__button--play') && $displayCounter.hasClass('dashboard-clock-counter--counter-blocked')) {
        // когда таймер на паузе

        timerVariables.title = `${timerVariables.ownerName} ${timerVariables.ownerSurname}`

        $progressBar.removeClass('dashboard-timer-display__progress-bar--stopped dashboard-clock-counter__container--paused')
        $counterContainer.removeClass('dashboard-clock-counter__container--paused')
        $actionButton.removeClass('dashboard-timer-control__button--play')
        $actionButton.addClass('dashboard-timer-control__button--pause outline')

        $progressBar.css('width', timerVariables.lineWidth + '%')

        timerVariables.active = true
        dashboardTimer(minutesLength, secondsLength)
    } else if ($actionButton.hasClass('dashboard-timer-control__button--pause')) {
        // когда таймер запущен

        timerVariables.title = 'Таймер на паузе'

        $progressBar.addClass('dashboard-timer-display__progress-bar--stopped dashboard-clock-counter__container--paused')
        $counterContainer.addClass('dashboard-clock-counter__container--paused')
        $actionButton.removeClass('dashboard-timer-control__button--pause outline')
        $actionButton.addClass('dashboard-timer-control__button--play')

        clearInterval(timerVariables.interval)
        timerVariables.active = false
    } else {
        // когда таймер не запущен

        if (+minutesLength + +secondsLength === 0) return // не запускаем если нет никакого значения

        timerVariables.title = `${timerVariables.ownerName} ${timerVariables.ownerSurname}`

        $progressBar.removeClass('dashboard-timer-display__progress-bar--hidden')
        $displayCounter.addClass('dashboard-clock-counter--counter-blocked')
        $actionButton.removeClass('dashboard-timer-control__button--play')
        $actionButton.addClass('dashboard-timer-control__button--pause outline')

        $stopButton.show()

        timerVariables.initialMinutes = minutesLength
        timerVariables.initialSeconds = secondsLength

        $progressBar.css('width', '100%')

        timerVariables.lineWidth = 100

        timerVariables.active = true
        dashboardTimer(minutesLength, secondsLength)
    }

    $topTimerContainer.find('.dashboard-timer-display__info').text(timerVariables.title)
}

function activateDashboardTimer() {
    const $openButton = $('.dashboard-tools-timer')
    const $template = timerMainContainer()

    const $pageTemplate = $('.main-wrapper')

    $('.dashboard-tracking-list-container--landing').addClass('dashboard-tracking-list-container--timer')

    const $controlBlock = dashboardTimerControl() 

    $template.find('.dashboard-clock-counter__input').on('input', function () {
        inputHandler(this)
    })

    $template.find('.dashboard-clock-counter__input').on('focus', function () {
        $(this).select()
    })

    $template.find('#timer-minutes').on('keydown', function (e) {
        keyDownHandler(this, e, true)
    })
    $template.find('#timer-seconds').on('keydown', function (e) {
        keyDownHandler(this, e, false)
    })

    $template.find('#timer-minutes').on('keyup', function (e) {
        keyUpHandler(this, e, true)
    })
    $template.find('#timer-seconds').on('keyup', function (e) {
        keyUpHandler(this, e, false)
    })

    $template.find('#timer-minutes').on('blur', function () {
        timerVariables.keyDownBtns.length = 0
        timerVariables.clickTimesMinutes = 0
    })
    $template.find('#timer-seconds').on('blur', function () {
        timerVariables.keyDownBtns.length = 0
        timerVariables.clickTimesSeconds = 0
    })


    // можем не показывать блок управления
    $template.find('.dashboard-timer-container__wrapper').append($controlBlock)

    $template.find('.dashboard-timer-control__button--one').on('click', function () {
        timerAddMinutes(timerVariables.addOneVal)
    })
    $template.find('.dashboard-timer-control__button--five').on('click', function () {
        timerAddMinutes(timerVariables.addFiveVal)
    })



    if ($openButton.hasClass('dashboard-tools-timer--timer-active')) {
        // когда таймер есть

        if ($('.dashboard-timer-display__counter').hasClass('dashboard-clock-counter--counter-blocked')) {
            // когда таймер запущен

            hideTimer()
        } else {
            // когда таймер не запущен

            removeTimer()
        }

    } else if ($openButton.hasClass('dashboard-tools-timer--active-count')) {
        // когда таймер свёрнут

        removeMiniTimer()
    } else {
        // когда таймера нет

        $openButton.addClass('dashboard-tools-timer--timer-active')

        $pageTemplate.append($template)

        var $hideButton = $('.dashboard-timer-display__hide-button')
        var $actionButton = $('#timer-play')
        var $stopButton = $('#timer-stop')
        var $progressBar = $('.dashboard-timer-display__progress-bar')
        var $counterContainer = $('.dashboard-clock-counter__container')
        var $displayCounter = $('.dashboard-timer-display__counter')
        var $topTimerContainer = $('.dashboard-timer-display')

        const timerContainerProps = {
            $actionButton,
            $stopButton,
            $progressBar,
            $counterContainer,
            $displayCounter,
            $topTimerContainer,
        }

        // для firefox
        if (typeof InstallTrigger !== 'undefined') $('#timer-minutes').focus()

        checkNoValue()

        $hideButton.on('click', function () {
            if ($displayCounter.hasClass('dashboard-clock-counter--counter-blocked')) {
                // когда таймер запущен

                hideTimer($openButton)
            } else {
                // когда таймер не запущен

                removeTimer($openButton)
            }
        })

        $stopButton.on('click', function () {
            stopClickHandler(timerContainerProps)
        })

        $actionButton.on('click', function () {
            actionClickHandler(timerContainerProps)
        })
    }

    $template.on('wheel', e => { if (e.ctrlKey) e.preventDefault() })
}

function dashboardTimer(minutes, seconds) {
    if (timerVariables.interval) {
        clearInterval(timerVariables.interval);
    }

    let timerLength = +minutes * 60 + +seconds // основное число, количество секунд в таймере

    if (!timerVariables.active || isNaN(timerLength)) return

    let progressBarStep = timerVariables.lineWidth / timerLength

    const $minutesContainer = $('#timer-minutes')
    const $secondsContainer = $('#timer-seconds')
    const $progressBar = $('.dashboard-timer-display__progress-bar')

    timerVariables.interval = setInterval(function () {
        let minutesLength = $minutesContainer.prop('value')

        const $timerContainer = $('.dashboard-timer-container')

        timerLength--

        if (timerLength < 11) {
            $('.dashboard-clock-counter__foreground, .dashboard-tools-timer').addClass('timer-ending')
        }

        // попроцентно уменьшаем длинну прогресс-бара, соответственно оставшимся секундам
        $progressBar.css('width', timerVariables.lineWidth - progressBarStep.toFixed(2) + '%')
        timerVariables.lineWidth = timerVariables.lineWidth - progressBarStep.toFixed(2)

        // если менее минуты - значение минут 00. если более, но менее 10 минут - добавляем ноль перед числом. проверяем пока значение минут не станет 00
        let minuteValue = Math.floor(timerLength / 60)

        if (minutesLength !== '00') {
            $minutesContainer.prop('value', minuteValue !== 0 ? minuteValue < 10 ? '0' + minuteValue : minuteValue : '00')
        }

        // добавляем ноль перед однозначными секундами
        $secondsContainer.prop('value', timerLength % 60 < 10 ? '0' + timerLength % 60 : timerLength % 60)

        // передаём значение таймера на корешок вкладки
        document.title = `${$minutesContainer.prop('value')}:${$secondsContainer.prop('value')} - ${timerVariables.documentTitle}`

        // передаём значение таймера в мини-контейнер при сворачивании
        if ($timerContainer.hasClass('dashboard-timer-container--hide-timer')) {
            $('#mini-minutes').text($minutesContainer.prop('value'))
            $('#mini-seconds').text($secondsContainer.prop('value'))
        }

        if ($minutesContainer.prop('value') === '00' && $secondsContainer.prop('value') === '00') {
            // таймер завершён

            timerVariables.title = 'Новый таймер'

            $('.dashboard-clock-counter__foreground, .dashboard-tools-timer').removeClass('timer-ending')
            $('#timer-play').removeClass('dashboard-timer-control__button--pause outline')
            $('#timer-play').addClass('dashboard-timer-control__button--play')
            $('.dashboard-timer-display__counter').removeClass('dashboard-clock-counter--counter-blocked')
            $('#timer-stop').hide()

            $('.dashboard-timer-display').find('.dashboard-timer-display__info').text(timerVariables.title)

            clearInterval(timerVariables.interval)

            timerVariables.active = false
            timerVariables.lineWidth = 100
            timerVariables.interval = null

            $progressBar.css('width', '100%')
            $progressBar.addClass('dashboard-timer-display__progress-bar--hidden')

            document.title = `${timerVariables.documentTitle}`

            $minutesContainer.prop('value', timerVariables.initialMinutes)
            $secondsContainer.prop('value', timerVariables.initialSeconds)

            if ($('.dashboard-tools-timer').hasClass('dashboard-tools-timer--active-count')) {
                removeMiniTimer()
            }

            return
        }
    }, 1000)
}

// Init
const activateButton = $('.dashboard-tools-timer')

activateButton.on('click', () => activateDashboardTimer())