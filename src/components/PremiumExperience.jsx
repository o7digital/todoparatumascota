import { createElement as h, Fragment, useEffect } from 'react';
import regions from '../lib/reference-markup.json';
import { initializeExperience } from '../lib/app.js';

// Preserve the supplied markup within each component and reuse its controller.
function Region({ name }) {
  return h('div', { className: 'reference-section', dangerouslySetInnerHTML: { __html: regions[name] } });
}
function Header() { return h(Region, {name:'header'}); }
function Hero() { return h(Fragment, null, h(Region,{name:'hero'}),h(Region,{name:'chapter-strip'})); }
function UniverseExplorer() { return h(Region, {name:'universes'}); }
function PersonalizedJourney() { return h(Region, {name:'concierge'}); }
function Travel() { return h(Region, {name:'travel'}); }
function DailyCare() { return h(Region, {name:'life-edit'}); }
function Remembrance() { return h(Region, {name:'memory'}); }
function FooterAndDialogs() { return h(Region, {name:'footer'}); }
export default function PremiumExperience() {
  useEffect(() => initializeExperience(), []);
  return h(Fragment,null,h(Header),h('main',null,
    h(Hero),h(Region,{name:'manifesto'}),h(UniverseExplorer),
    h(PersonalizedJourney),h(Travel),h(DailyCare),h(Remembrance),
    h(Region,{name:'final-section'})
  ),h(FooterAndDialogs));
}
