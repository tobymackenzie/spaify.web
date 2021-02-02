<?php
require_once(__DIR__ . '/_inc.php');
//--handle 404 here because cli-server uses home page file as router for 404s by default
if(!(empty($_SERVER['PATH_INFO']) || $_SERVER['PATH_INFO'] === '/')){
	http_response_code(404);
	$ts->set('title', '500 Not Found');
	$ts->set('main', '<h1>404 Not Found</h1><p>Apologies. Could not find what you asked for.</p>');
	$ts->end('main');
	echo $ts;
	die();
}
$ts->set('main');
?>
<h1>Tests Home</h1>
<p>Hello there.  See the <a href="https://macn.me">external link</a>.  Or go to <a href="/internal1/">Internal 1</a>.</p>
<p>Amet kenny lofton feugiat dorothy dandridge nunc, cavaliers independence littera ozzie newsome eros. Assum sit decima jim brown. Veniam nisl ohio city lectores per, consequat hendrerit eleifend. Legentis ipsum dead man’s curve sit sed hal holbrook, soluta quam mark price olmsted falls seacula augue. Qui james a. garfield clari in notare quam fairview park liber. West side brad daugherty gothica vero, te, nobis. Indians et et duis. Ullamcorper parum videntur facer bedford consectetuer etiam typi. In screamin’ jay hawkins doming ut mutationem autem, investigationes ipsum cleveland heights minim linndale urban meyer. Paul brown insitam brook park anne heche duis bratenahl saepius lius augue, the gold coast processus quis. Clari nonummy qui ex cleveland, odio steve harvey vel, university circle tincidunt luptatum parum. Euclid bob hope claritatem strongsville ipsum, vel.</p>
<p>Litterarum doming investigationes wisi. Demonstraverunt joel grey roger zelazny luptatum vel bowling notare dolore sam sheppard at facilisis nulla. Dolor arsenio hall ruby dee erat iriure ex in typi claritas iusto. Seven hills nunc lorem sammy kaye, shaker heights claram magna lobortis. Consectetuer uss cod et formas. Dolor nibh iusto lorem rocky river parum, lorem, sequitur usus ipsum ut nulla. Don shula hendrerit ut oakwood decima insitam euismod velit molestie quod. Nunc richmond heights dolore exerci fiant wisi moreland hills george voinovich, orange, feugait ut qui. Euclid beach etiam dolore sandy alomar.</p>
<p>Cuyahoga valley north randall pierogies maple heights quis jim tressel. In major everett me carl b. stokes facilisi humanitatis qui in seacula sit. Assum mayfield heights in placerat feugiat gund arena chagrin falls township aliquam. Sollemnes cuyahoga river bobby knight et, dolore, putamus. Enim zzril claritas tation toni morrison modo, bay village illum adipiscing delenit. Elit eum garfield heights mike golic jesse owens, accumsan legunt nihil. Great lakes science center possim mazim westlake highland heights quod. Tracy chapman option duis adipiscing consequat lake erie valley view consuetudium. Aliquam the metroparks east side humanitatis. Facilisis the arcade bob feller north olmsted gothica, esse fiant, bernie kosar futurum michael stanley. John w. heisman accumsan john d. rockefeller facit ii, frank yankovic claram dolore. Duis quod blandit brooklyn heights litterarum, consequat, suscipit lebron james, emerald necklace facer decima quam.</p>
<p>Nibh in dolor legere decima dennis kucinich, lius ea. Zzril ad berea rock & roll hall of fame consuetudium commodo burgess meredith mutationem non andre norton ea nobis. Est id volutpat est dolor pepper pike, patricia heaton sollemnes dolor henry mancini. Illum facit collision bend dignissim university heights quarta te municipal stadium. Jacobs field et est dolore michael symon quinta cleveland museum of art volutpat habent me id middleburg heights. Futurum est jerry siegel metroparks zoo nisl nunc harvey pekar philip johnson glenwillow enim. Elit soluta cedar point magna lyndhurst gates mills lebron departum arena depressum metro quatro annum returnum celebra gigantus nulla typi squire’s castle esse quinta. Walton hills north royalton harlan ellison placerat joe shuster tincidunt. Possim bentleyville clay mathews nulla dolor vel vulputate iis quod ghoulardi facilisi claritatem.</p>
<p>Claritatem qui sequitur vulputate putamus solon qui ad est beachwood don king dynamicus. Sed dignissim imperdiet erat, broadview heights nobis. Mentor headlands newburgh heights ut molly shannon littera amet, amet cuyahoga heights superhost, chrissie hynde sit eu. Nobis bedford heights nostrud lakeview cemetary, jim lovell diam nihil langston hughes. Est brecksville eros praesent. Browns mazim qui lorem legentis eodem. Non chagrin falls amet praesent eric carmen liber william g. mather, videntur delenit option. Saepius at lew wasserman, in eleifend blandit. Severance hall paul newman playhouse square hunting valley margaret hamilton iriure consequat drew carey geauga lake minim peter b. lewis tempor. Omar vizquel iis nam dynamicus michael ruhlman typi imperdiet per. Laoreet tation mirum usus processus autem parum debra winger. Eum et the innerbelt eu parma heights mayfield village.</p>
<?php
$ts->end('main');
echo $ts;
