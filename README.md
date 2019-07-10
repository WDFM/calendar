#Calendar plugin
Show a simple calendar.

##Usage
1. Reference CSS and javascript files in your page.
2. Params (optional)

    param|type|usage|default value
    --|:--:|:--:|:--:
    width|String|calendar's width, like '100px', '50%'|'auto'
    height|String|calendar's height, like '100px', '50%'|'auto'
    year|Number|which year calendar shows, like 2019|Current year
    month|Number|Number|which month calendar shows, like 12|Current month
    selector|String|calendar container, it's a css selector, like '.calendar-container'|'#calendar-container'

    ```
    // example
    calendar.init({
        width: '10%' //or '200px',
        height: '10%' //or '200px',
        year: 2019,
        month: 12,
        selector: '#calendar-container'
    })
    ```
