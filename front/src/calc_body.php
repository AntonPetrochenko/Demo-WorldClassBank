<div class="calc">
    <h1>Калькулятор</h1>
    <form class="calc-body" name="calc">
        <div class="group-caption">Дата оформления вклада</div>
        <div class="form-group">
            <input type="text" name="date" placeholder="дд.мм.гггг" id="calc-date">
        </div>
        
        <div class="group-caption">Сумма вклада</div>
        <div class="form-group">
            <input type="text" name="sumInitial" id="calc-sum-initial">
            <div class=range-group>
                <div class="start-amount">1 тыс. руб </div>
                <input type="range" min=1000 max=3000000>
                <div class="end-amount">3 000 000</div>
            </div>
        </div>

        <div class="group-caption">Срок вклада</div>
        <div class="form-group">
            <select name="term" id="calc-term">
                <option value=1>1 год</option>
                <option value=2>2 года</option>
                <option value=3>3 года</option>
                <option value=4>4 года</option>
                <option value=5>5 лет</option>
            </select>
        </div>
        
        <div class="group-caption">Пополнение вклада</div>
        <div class="form-group">
            
            <input type=radio name="replinish" value="no" id="calc-replinish-no" checked>
            <label for="calc-replinish-no">Нет</label>

            <input type=radio name="replinish" value="yes" id="calc-replinish-yes">
            <label for="calc-replinish-yes">Да</label>
        </div>

        <div class="group-caption">Сумма пополнения вклада</div>
        <div class="form-group">
            <input type="text" name="sumReplinish" id="calc-sum-replinish">
            <div class=range-group>
                <div class="start-amount">1 тыс. руб </div>
                <input type="range" min=1000 max=3000000>
                <div class="end-amount">3 000 000</div>
            </div>
        </div>
        <div class="form-group">
            <button onclick="validateAndSendCalc(document.forms.calc)" type="button" class="calculate">Рассчитать</button> <span id=result></span>
        </div>
        <div class="form-group">
            <span class="loader" id=calc-loader></span><span id="calc-result"></span>
        <div>
    </form>
</div>