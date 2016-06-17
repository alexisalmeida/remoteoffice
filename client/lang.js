var p1_en = "This website is built on the Meteor platform. Here you can have a small sample " +
	"of the power of this framework. The flexibility and interactivity obtained considering " +
	"the time required to build justifies its name. Development is super fast. You can go as " +
	"high and fast as a meteor while delivering a high quality product with elements and super " +
	"modern visual characteristics to fully meet the needs of your customer.";
var p2_en = "The portfolio has a news site example whose layout can be easily modified. The " +
	"layout is divided into sections consisting of one or more news. The reports, in turn, are " +
	"stored and retrieved from a database automatically and in real time. Each section has its " +
	"own layout, allowing the administration of each section separately. The website also provides " +
	"a section of composite photo albums news, whose contents are photos related to a particular " +
	"theme, with its own title and descriptive text. As well as news, photos are also stored in " +
	"the database and consulted in real time through the site.";
var p3_en = "O blog do portfólio é implementado com base em um dos milhares de componentes " +
	"disponíveis para uso gratuito na plataforma Meteor. O componente implementa uma completa " +
	"interface de gerenciamento, onde o administrador do blog pode criar, editar e publicar seus " +
	"posts.";
var p4_en = "<b>Explore our website and feel the fascinating world of Meteor.<b>";

var p1_pt = "Este website foi construído sobre a plataforma Meteor. Aqui você pode ter uma pequena " +
	"amostra do poder desse framework. A flexibilidade e a interatividade obtida considerando-se " +
	"o tempo necessário para construir, justifica o seu nome. O desenvolvimento é super acelerado. " +
	"Você pode ir tão alto e rápido como um meteóro e ao mesmo tempo entregar um produto de alta " +
	"qualidade, com elementos e características visuais super modernas para atendimento pleno das " +
	"necessidades do seu cliente.";
var p2_pt = "O portifólio apresenta um exemplo de site de notícias cujo layout pode ser facilmente " +
	"modificado. O layout é estruturado em seções compostas de uma ou mais notícias. As notícias, " +
	"por sua vez, são armazenadas e recuperadas de um banco de dados de maneira automática e em " +
	"tempo real. Cada seção tem seu próprio layout, permitindo a administração de cada seção " +
	"em separado. O site também provê uma seção de foto notícias composta de albuns cujo conteúdo " +
	"são fotos relacionadas a um determinado tema, com seu próprio título e texto descritivo. " +
	"Assim como as notícias, as fotos também são armazenadas em banco de dados e consultadas " +
	"em tempo real pelo site.";
var p3_pt = "O blog do portfólio é implementado com base em um dos milhares de componentes " +
	"disponíveis para uso gratuito na plataforma Meteor. O componente implementa uma completa " +
	"interface de gerenciamento, onde o administrador do blog pode criar, editar e publicar " +
	"seus posts.";
var p4_pt = "<b>Explore nosso website e sinta o fascinante mundo do Meteor.<b>";

var dicEn = {
    "pt":"portuguese",
    "en":"english",
	"about": "About",
    "report":"Report",
	"active":"Active",
	"interval":"Interval",
	"meeting": "Meeting",
	"msg001": "Video stream not available.",
	"msg002": "Please, wait...",
	"msg003": "ERROR: User already registered in the team of ",
	"msg004": "Please, select a destinatary.",
	"msg005": "Please, type a message.",
	"msg006": "Displaying the 50 most recent records.",
	"msg007": "Displaying the 10 most recent chats.",
	"msg008": "You are being filmed and your manager may be seeing you at this time.",
	"p1": p1_en,
	"p2": p2_en,
	"p3": p3_en,
	"p4": p4_en,
	"Home": "Home",
	"admin": "Manager",
	"report": "Report",
	"team": "Team",
	"addUser": "Add a user to your team",
	"infoUser": "Entry user id",
	"yourTeam": "Your team",
	"username": "userId",
	"dtini": "Initial date",
	"dtfim": "End date",
	"Go": "Go",
	"Return": "Return",
	"Log": "Log",
	"status": "Status",
	"date": "Date",
	"photo": "Photo",
	"proc": "Process",
	"message": "Message",
	"send": "Send",
	"clear": "Clear",
	"select": "Select",
	"nothing": "",
	"manager": "Your manager",
	"to": "to",
	"at": "at",
	"inactive": "inactive",
	"exit": "Exit",
};

var dicPt = {
    "pt":"português",
    "en":"inglês",
	"about": "Sobre",
	"report": "Relatório",
	"active":"Ativo",
	"interval":"Intervalo",
	"meeting": "Reunião",
	"msg001": "Vídeo não disponível.",
	"msg002": "Por favor, aguarde a página carregar...",
	"msg003": "ERRO: usuário já cadastrado na equipe de ",
	"msg004": "Por favor, selecione um destinatário.",
	"msg005": "Por favor, digite uma mensagem.",
	"msg006": "Exibindo os 50 registros mais recentes.",
	"msg007": "Exibindo os 10 chats mais recentes.",
	"msg008": "Você está sendo filmado e seu gestor pode estar vendo você neste momento.",
	"welcome": "Bem-vindo ao nosso portfólio de website.",
	"p1": p1_pt,
	"p2": p2_pt,
	"p3": p3_pt,
	"p4": p4_pt,
	"Home": "Início",
	"admin": "Gestor",
	"report": "Consultas",
	"team": "Equipe",
	"addUser": "Adiciona um usuário à sua equipe",
	"infoUser": "Informe o ID do usuário",
	"yourTeam": "Sua equipe",
	"username": "Id do usuário",
	"dtini": "Data inicial",
	"dtfim": "Data final",
	"Go": "Ir",
	"Return": "Voltar",
	"Log": "Log",
	"status": "Status",
	"date": "Data",
	"photo": "Foto",
	"proc": "Processo",
	"message": "Mensagem",
	"send": "Envia",
	"clear": "Limpa",
	"select": "Selecione",
	"nothing": "",
	"manager": "Seu gestor é",
	"to": "para",
	"at": "em",
	"inactive": "inativo",
	"exit": "Sair",	
};


lang.init("SESSION","pt");
lang.setDictionnary("pt",dicPt);
lang.setDictionnary("en",dicEn);
