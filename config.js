// Replace these sample details and images before launching a real restaurant.
// Address and schema metadata also appear in index.html for search engines.
window.MAISON_CONFIG = {
  name: 'Maison Alba',
  phoneDisplay: '+33 (0)0 00 00 00 00',
  phoneHref: '', // e.g. tel:+33412345678. Empty keeps the demo from calling an invented number.
  reservationEndpoint: '', // Optional HTTPS endpoint accepting JSON reservation inquiries.
  dishes: [
    {name:'Wild mushroom risotto',description:'Arborio rice, woodland mushrooms, aged Parmesan.',price:'24',image:'risotto',alt:'Illustrative plate of pasta with herbs representing seasonal Italian cooking'},
    {name:'Duck confit',description:'Slow-cooked duck, cherry jus, crisp potatoes.',price:'32',image:'duck',alt:'Illustrative roasted meat dish with vegetables'},
    {name:'Seafood paella for two',description:'Saffron rice, prawns, mussels, a little lemon.',price:'58',image:'paella',alt:'Illustrative seafood and rice dish in a rustic pan'},
    {name:'Burrata & roasted tomatoes',description:'Creamy burrata, sweet tomatoes, basil oil.',price:'16',image:'burrata',alt:'Illustrative Italian tomato pasta dish; replace with burrata photography'},
    {name:'Beef bourguignon',description:'Red wine braised beef, root vegetables, silky mash.',price:'29',image:'beef',alt:'Illustrative beef main with vegetables on a ceramic plate'},
    {name:'Lemon tart',description:'Buttery pastry, bright lemon, crème fraîche.',price:'11',image:'tart',alt:'Illustrative fruit dessert with cream; replace with lemon tart photography'}
  ],
  menus: {
    Starters:[['Burrata & roasted tomatoes','Basil oil, sourdough, a pinch of sea salt','16','V'],['Seared scallops','Cauliflower purée, brown butter, capers','19','GF'],['Seasonal garden plate','Market vegetables, white bean hummus, herbs','14','VG, GF'],['French onion soup','Slow-cooked onions, Gruyère toast','13','V']],
    Mains:[['Wild mushroom risotto','Arborio rice, woodland mushrooms, aged Parmesan','24','V, GF'],['Duck confit','Cherry jus, crisp potatoes, seasonal greens','32','GF'],['Seafood paella for two','Saffron rice, prawns, mussels, lemon','58','GF'],['Beef bourguignon','Red wine braised beef, root vegetables, silky mash','29','GF']],
    Desserts:[['Lemon tart','Buttery pastry, bright lemon, crème fraîche','11','V'],['Chocolate fondant','Warm dark chocolate, vanilla bean ice cream','12','V'],['Poached pear','Spiced red wine, toasted almonds','10','VG, GF'],['European cheese plate','Three cheeses, fruit preserve, crackers','16','V']],
    Wine:[['Loire Sauvignon Blanc','Crisp citrus, fresh herbs · 150 ml glass','9',''],['Provence Rosé','Dry, delicate, notes of wild strawberry · 150 ml glass','9',''],['Rioja Crianza','Red berries, subtle oak, soft spice · 150 ml glass','10',''],['Chianti Classico','Cherry, violet, a savoury finish · 750 ml bottle','42','']]
  },
  gallery:[['dining','A warm welcome','Warm restaurant dining room with greenery and wooden tables'],['paella','For the middle of the table','A colourful seafood and rice dish'],['bar','One more glass?','Softly lit restaurant bar and dining space'],['terrace','A slower kind of evening','An intimate restaurant table set for dinner'],['tart','Always room for something sweet','A creamy dessert topped with fresh fruit'],['kitchen','Behind the scenes','Fresh food being prepared in the kitchen']]
};
