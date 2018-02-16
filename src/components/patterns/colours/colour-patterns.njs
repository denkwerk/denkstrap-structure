<!--
never put styleguide css in your content css,
try to use your content styles,
or use inline styles like this.
-->


<style>
    .styleguide__list {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .styleguide__list:after {
        content: ' ';
        /* 1 */
        display: block;
        clear: both;
    }
    @media screen and (min-width: 481px) {
        .styleguide__list {
            margin: 0 15px;
        }
    }
    .styleguide__element {
        border: 1px solid #ccc;
        border-radius: 2px;
        box-sizing: border-box;
        padding: 5px;
    }
    @media screen and (max-width: 480px) {
        .styleguide__element {
            margin: 15px;
        }
    }
    @media screen and (min-width: 481px) {
        .styleguide__element {
            float: left;
            min-height: 170px;
            margin: 7.5px;
        }
    }
    @media screen and (min-width: 481px) and (max-width: 768px) {
        .styleguide__element {
            width: calc(50% - 7.5px);
        }
        .styleguide__element:nth-child(2n+1) {
            margin-left: 0;
        }
        .styleguide__element:nth-child(2n+2) {
            margin-right: 0;
        }
    }
    @media screen and (min-width: 769px) and (max-width: 1024px) {
        .styleguide__element {
            width: calc(100% / 3 - 11px);
        }
        .styleguide__element:nth-child(3n+1) {
            margin-left: 0;
        }
        .styleguide__element:nth-child(3n+3) {
            margin-right: 0;
        }
    }
    @media screen and (min-width: 1025px) and (max-width: 1299px) {
        .styleguide__element {
            width: calc(100% / 4 - 11.5px);
        }
        .styleguide__element:nth-child(4n+1) {
            margin-left: 0;
        }
        .styleguide__element:nth-child(4n+4) {
            margin-right: 0;
        }
    }
    @media screen and (min-width: 1300px) {
        .styleguide__element {
            width: calc(100% / 6 - 12.5px);
        }
        .styleguide__element:nth-child(6n+1) {
            margin-left: 0;
        }
        .styleguide__element:nth-child(6n+6) {
            margin-right: 0;
        }
    }
    .styleguide__colorbox {
        border: 1px solid transparent;
        border-radius: 2px;
        color: #ffffff;
        display: block;
        height: 70px;
    }
    .styleguide__definition--info {
        font-weight: 600;
    }
    .styleguide__definition {
        color: #000000;
        font-size: 14px;
        list-style: none;
        margin: 0.5em 0;
        padding: 0;
    }
    .sg-subtitle {
        border-bottom: 1px solid gray;
        font-size: 1em;
        font-weight: 400;
        line-height: 1.4;
        margin: 0 15px 15px;
        padding-bottom: 5px;
        text-transform: capitalize;
    }
    .sg-subtitle:not(:first-child) {
        margin-top: 10px;
    }
</style>

<h3 class="sg-subtitle">Main Colors</h3>
<ul class="styleguide__list">
    <li class="styleguide__element">
        <div class="styleguide__colorbox " style="background-color: #48c876;"></div>
        <ul class="styleguide__definition styleguide__definition--info">
            <li>#48c876</li>
            <li>$color-primary</li>
        </ul>
        <ul class="styleguide__definition styleguide__definition--usage">
            <li>Mobile Nav bg</li>
            <li>Desktop Nav active</li>
            <li>Button/CTA/Icons :hover</li>
        </ul>
    </li>
    <li class="styleguide__element">
        <div class="styleguide__colorbox " style="background-color: #eee;"></div>
        <ul class="styleguide__definition styleguide__definition--info">
            <li>#eeeeee</li>
            <li>$color-secondary</li>
        </ul>
        <ul class="styleguide__definition styleguide__definition--usage">
            <li>Desktop Nav bg</li>
            <li>Mobile Nav active</li>
            <li>Module Section bg</li>
        </ul>
    </li>
</ul>

<h3 class="sg-subtitle">Color Shades</h3>
<ul class="styleguide__list">
    <li class="styleguide__element">
        <div class="styleguide__colorbox " style="background-color: #fefefe;"></div>
        <ul class="styleguide__definition styleguide__definition--info">
            <li>#fefefe</li>
            <li>$white</li>
        </ul>
        <ul class="styleguide__definition styleguide__definition--usage">
            <li>body bg</li>
            <li>inverted text color</li>
        </ul>
    </li>
    <li class="styleguide__element">
        <div class="styleguide__colorbox " style="background-color: #eeeeee;"></div>
        <ul class="styleguide__definition styleguide__definition--info">
            <li>#eeeeee</li>
            <li>$light-grey</li>
        </ul>
        <ul class="styleguide__definition styleguide__definition--usage">
            <li>backgrounds</li>
            <li>Mobile Nav :hover</li>
        </ul>
    </li>
    <li class="styleguide__element">
        <div class="styleguide__colorbox  styleguide__bright" style="background-color: #e9e9e9;"></div>
        <ul class="styleguide__definition styleguide__definition--info">
            <li>#e9e9e9</li>
            <li>$mid-grey</li>
        </ul>
        <ul class="styleguide__definition styleguide__definition--usage">
            <li>Desktiop Nav :hover</li>
            <li>Section Background</li>
        </ul>
    </li>
    <li class="styleguide__element">
        <div class="styleguide__colorbox " style="background-color: #dddddd;"></div>
        <ul class="styleguide__definition styleguide__definition--info">
            <li>#dddddd</li>
            <li>$grey</li>
        </ul>
        <ul class="styleguide__definition styleguide__definition--usage">
            <li>Markdown Code</li>
        </ul>
    </li>
    <li class="styleguide__element">
        <div class="styleguide__colorbox " style="background-color: #cccccc;"></div>
        <ul class="styleguide__definition styleguide__definition--info">
            <li>#cccccc</li>
            <li>$dark-grey</li>
        </ul>
        <ul class="styleguide__definition styleguide__definition--usage">
            <li>Borders</li>
        </ul>
    </li>
    <li class="styleguide__element">
        <div class="styleguide__colorbox " style="background-color: #111111;"></div>
        <ul class="styleguide__definition styleguide__definition--info">
            <li>#111111</li>
            <li>$black</li>
        </ul>
        <ul class="styleguide__definition styleguide__definition--usage">
            <li>Text</li>
            <li>Button/CTA/Icons</li>
        </ul>
    </li>
</ul>
