
const botaoMenu = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');

function fecharMenu() {
    menu.classList.remove('open');
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.textContent = '☰';
}

botaoMenu.addEventListener('click', () => {
    const abriu = menu.classList.toggle('open'); // toggle devolve true se a classe ficou
    botaoMenu.setAttribute('aria-expanded', String(abriu));
    botaoMenu.textContent = abriu ? '✕' : '☰';
});

menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', fecharMenu));

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') fecharMenu();
});



const secoes = document.querySelectorAll('main section[id]');
const linksMenu = document.querySelectorAll('.nav-menu a');

const observadorSecoes = new IntersectionObserver(
    (entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            linksMenu.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + entrada.target.id);
            });
        });
    },
    { rootMargin: '-40% 0px -55% 0px' }
);

secoes.forEach((secao) => observadorSecoes.observe(secao));



const HORARIO = { abre: 8, fecha: 21 };

function atualizarStatus() {
    const elemento = document.querySelector('#status');

    const hora = Number(
        new Intl.DateTimeFormat('pt-BR', {
            hour: 'numeric',
            hourCycle: 'h23',
            timeZone: 'America/Sao_Paulo',
        }).format(new Date())
    );

    const aberto = hora >= HORARIO.abre && hora < HORARIO.fecha;

    elemento.textContent = aberto
        ? `🟢 Aberto agora, atendemos até as ${HORARIO.fecha}h`
        : `🔴 Fechado agora, abrimos às ${HORARIO.abre}h`;
    elemento.classList.toggle('aberto', aberto);
    elemento.classList.toggle('fechado', !aberto);
}

atualizarStatus();
setInterval(atualizarStatus, 60 * 1000); // reavalia a cada minuto



const valorHora = Number(document.querySelector('.price').dataset.valor);
const campoHoras = document.querySelector('#horas');
const textoTotal = document.querySelector('#total');
const linkOrcamento = document.querySelector('#calc-whatsapp');
const linkContato = document.querySelector('#contato a[href^="https://wa.me/"]');

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const MIN_HORAS = Number(campoHoras.min);
const MAX_HORAS = Number(campoHoras.max);
const PASSO = Number(campoHoras.step);

function lerHoras() {
    const valor = Number(campoHoras.value);
    if (Number.isNaN(valor)) return MIN_HORAS;
    return Math.min(MAX_HORAS, Math.max(MIN_HORAS, valor));
}

function atualizarOrcamento() {
    const horas = lerHoras();
    const total = horas * valorHora;
    textoTotal.textContent = moeda.format(total);


    const base = new URL(linkContato.href);
    const mensagem =
        `Olá! Gostaria de agendar uma tattoo. ` +
        `Pela simulação do site, a sessão deve levar cerca de ${horas.toLocaleString('pt-BR')}h ` +
        `(estimativa de ${moeda.format(total)}).`;
    linkOrcamento.href = `${base.origin}${base.pathname}?text=${encodeURIComponent(mensagem)}`;
}

function mudarHoras(delta) {
    campoHoras.value = Math.min(MAX_HORAS, Math.max(MIN_HORAS, lerHoras() + delta));
    atualizarOrcamento();
}

document.querySelector('#menos').addEventListener('click', () => mudarHoras(-PASSO));
document.querySelector('#mais').addEventListener('click', () => mudarHoras(PASSO));
campoHoras.addEventListener('input', atualizarOrcamento);


campoHoras.addEventListener('blur', () => {
    campoHoras.value = lerHoras();
    atualizarOrcamento();
});

atualizarOrcamento();


document.querySelector('#ano').textContent = new Date().getFullYear();
