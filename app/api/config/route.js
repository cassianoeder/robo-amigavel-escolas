import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const result = await db.execute({
      sql: 'SELECT * FROM robot_configs WHERE user_id = ?',
      args: [user.userId]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({});
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Get config error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    
    const {
      webhookUrl = '',
      jwtToken = '',
      corDestaque = 'azul-escuro',
      vozIndex = 0,
      velocidadeFala = 1.0,
      timeoutSonolencia = 40,
      sessaoId = '',
      isKidsMode = false,
      topicDia = '',
      volumeRobo = 100,
      robotName = 'Robô',
      nomeProfessor = '',
      pais = '',
      estado = '',
      cidade = '',
      nomeEscola = '',
      salaLocal = '',
      codigoBNCC = '',
      descricaoBNCC = '',
      disciplina = '',
      objetivoAula = '',
      turno = '',
      proximosEventos = '',
      avisosGerais = '',
      eventosHoje = '',
      nomeDiretor = '',
      nomeRecepcionista = '',
      nomeSecretario = '',
      hatEnabled = false,
      hatColor = '#333333',
      hatLogo = '',
      fishSttEnabled = false,
      fishTtsEnabled = false
    } = body;

    const sanitize = (str) => {
      if (typeof str !== 'string') return '';
      return str.substring(0, 255).replace(/<[^>]*>/g, '');
    };

    const sanitizeLarge = (str) => {
      if (typeof str !== 'string') return '';
      return str.substring(0, 1000).replace(/<[^>]*>/g, '');
    };

    await db.execute({
      sql: `
        INSERT INTO robot_configs (
          user_id, webhookUrl, jwtToken, corDestaque, vozIndex, 
          velocidadeFala, timeoutSonolencia, sessaoId, isKidsMode, topicDia, volumeRobo,
          robotName, nomeProfessor, pais, estado, cidade, nomeEscola, salaLocal,
          codigoBNCC, descricaoBNCC, hatEnabled, hatColor, hatLogo,
          nomeDiretor, nomeRecepcionista, nomeSecretario,
          disciplina, objetivoAula, turno, proximosEventos, avisosGerais, eventosHoje,
          fish_stt_enabled, fish_tts_enabled
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          webhookUrl = excluded.webhookUrl,
          jwtToken = excluded.jwtToken,
          corDestaque = excluded.corDestaque,
          vozIndex = excluded.vozIndex,
          velocidadeFala = excluded.velocidadeFala,
          timeoutSonolencia = excluded.timeoutSonolencia,
          sessaoId = excluded.sessaoId,
          isKidsMode = excluded.isKidsMode,
          topicDia = excluded.topicDia,
          volumeRobo = excluded.volumeRobo,
          robotName = excluded.robotName,
          nomeProfessor = excluded.nomeProfessor,
          pais = excluded.pais,
          estado = excluded.estado,
          cidade = excluded.cidade,
          nomeEscola = excluded.nomeEscola,
          salaLocal = excluded.salaLocal,
          codigoBNCC = excluded.codigoBNCC,
          descricaoBNCC = excluded.descricaoBNCC,
          hatEnabled = excluded.hatEnabled,
          hatColor = excluded.hatColor,
          hatLogo = excluded.hatLogo,
          nomeDiretor = excluded.nomeDiretor,
          nomeRecepcionista = excluded.nomeRecepcionista,
          nomeSecretario = excluded.nomeSecretario,
          disciplina = excluded.disciplina,
          objetivoAula = excluded.objetivoAula,
          turno = excluded.turno,
          proximosEventos = excluded.proximosEventos,
          avisosGerais = excluded.avisosGerais,
          eventosHoje = excluded.eventosHoje,
          fish_stt_enabled = excluded.fish_stt_enabled,
          fish_tts_enabled = excluded.fish_tts_enabled,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        user.userId, webhookUrl, jwtToken, corDestaque, vozIndex,
        velocidadeFala, timeoutSonolencia, sessaoId, isKidsMode ? 1 : 0, topicDia, volumeRobo,
        robotName, nomeProfessor, pais, estado, cidade, nomeEscola, salaLocal,
        codigoBNCC, descricaoBNCC,
        hatEnabled ? 1 : 0, hatColor, hatLogo,
        sanitize(nomeDiretor), sanitize(nomeRecepcionista), sanitize(nomeSecretario),
        sanitize(disciplina), sanitize(objetivoAula), sanitize(turno),
        sanitizeLarge(proximosEventos), sanitizeLarge(avisosGerais), sanitizeLarge(eventosHoje),
        fishSttEnabled ? 1 : 0, fishTtsEnabled ? 1 : 0
      ]
    });

    return NextResponse.json({ message: 'Configuração salva com sucesso' });
  } catch (error) {
    console.error('Save config error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
