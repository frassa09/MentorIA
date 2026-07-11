import { InteracaoChat, Trilha, Progresso, ConteudoTrilha } from '../models/index.js';
import { completar, validarContextoProgramacao, extractAIConfig } from '../config/aiService.js';

export async function perguntar(req, res) {
  try {
    const { pergunta, id_trilha } = req.body;
    const id_aluno = req.usuario.id;
    const aiConfig = extractAIConfig(req);

    if (!pergunta) {
      return res.status(400).json({ status: 'ERRO', mensagem: 'Pergunta obrigatoria' });
    }

    const validacao = await validarContextoProgramacao(pergunta, aiConfig);
    if (!validacao.valido) {
      return res.status(400).json({ status: 'ERRO', mensagem: validacao.mensagem });
    }

    let contextoTrilha = '';

    if (id_trilha) {
      const trilha = await Trilha.findByPk(id_trilha, {
        include: [ConteudoTrilha],
      });

      if (trilha) {
        const abas = (trilha.ConteudoTrilhas || [])
          .sort((a, b) => a.ordem - b.ordem)
          .map((a) => `${a.titulo_aba}: ${a.conteudo_html}`)
          .join('\n\n');

        contextoTrilha = `Contexto da trilha "${trilha.nome}" (nivel ${trilha.nvl}):
Resumo: ${trilha.resumo || 'Nao disponivel'}
Conteudo:
${abas || 'Nao disponivel'}

`;
      }
    }

    const progresso = await Progresso.findOne({ where: { id_aluno } });
    const nivel = progresso?.nivel || 'iniciante';

    const prompt = `${contextoTrilha}Voce e um mentor virtual de programacao e tecnologia. O aluno esta no nivel "${nivel}".
Baseie sua resposta no contexto da trilha fornecido acima. Se nao houver contexto, responda de forma geral sobre programacao/tecnologia.
Responda de forma didatica e simples, adaptando a linguagem ao nivel do aluno.
Voce SOBEM responder sobre programacao, desenvolvimento de software, e areas tech.

Pergunta: ${pergunta}`;

    const resposta = await completar({ ...aiConfig, prompt, temperature: 0.7 });

    await InteracaoChat.create({
      id_aluno,
      id_trilha: id_trilha || null,
      pergunta,
      resposta,
    });

    return res.json({ status: 'SUCESSO', resposta });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'ERRO', mensagem: 'Erro ao responder' });
  }
}

export async function historico(req, res) {
  try {
    const { id_trilha } = req.query;
    const where = { id_aluno: req.usuario.id };

    if (id_trilha) where.id_trilha = id_trilha;

    const interacoes = await InteracaoChat.findAll({
      where,
      order: [['createdAt', 'ASC']],
    });

    return res.json({ status: 'SUCESSO', interacoes });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'ERRO' });
  }
}

export async function limparHistorico(req, res) {
  try {
    const id_aluno = req.usuario.id;

    await InteracaoChat.destroy({ where: { id_aluno } });

    return res.json({ status: 'SUCESSO', mensagem: 'Historico limpo' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: 'ERRO' });
  }
}
