import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Suporte para impersonation (admin vendo outro usuário)
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');
    let effectiveUserId = user.userId;

    if (targetUserId && user.isAdmin) {
      effectiveUserId = parseInt(targetUserId);
    }

    const result = await db.execute({
      sql: 'SELECT * FROM robot_configs WHERE user_id = ?',
      args: [effectiveUserId]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({});
    }

    const row = result.rows[0];
    // Map DB snake_case to camelCase for frontend
    const config = {
      ...row,
      publicEnabled: row.public_enabled === 1 || row.public_enabled === true,
      publicPassword: row.public_password || '',
      publicSlug: row.public_slug || '',
    };

    return NextResponse.json(config);
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

    // Suporte para impersonation (admin salvando em outro usuário)
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');
    let effectiveUserId = user.userId;

    if (targetUserId && user.isAdmin) {
      effectiveUserId = parseInt(targetUserId);
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
      publicEnabled = false,
      publicPassword = ''
    } = body;

    const sanitize = (str) => {
      if (typeof str !== 'string') return '';
      return str.substring(0, 255).replace(/<[^>]*>/g, '');
    };

    const sanitizeLarge = (str) => {
      if (typeof str !== 'string') return '';
      return str.substring(0, 1000).replace(/<[^>]*>/g, '');
    };

    let currentSlug = null;
    try {
      const existing = await db.execute({
        sql: 'SELECT public_slug FROM robot_configs WHERE user_id = ?',
        args: [effectiveUserId]
      });
      if (existing.rows.length > 0) {
        currentSlug = existing.rows[0].public_slug;
      }
    } catch (e) {
      console.warn("Could not fetch existing slug", e);
    }

    if (!currentSlug && publicEnabled) {
       const baseSlug = robotName ? robotName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-') : 'robo';
       const dateStr = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12); // format YYYYMMDDHHMM
       currentSlug = `${baseSlug}-${dateStr}`.replace(/-+$/, '');
    }

    await db.execute({
      sql: `
        INSERT INTO robot_configs (
          user_id, webhookUrl, jwtToken, corDestaque, vozIndex, 
          velocidadeFala, timeoutSonolencia, sessaoId, isKidsMode, topicDia, volumeRobo,
          robotName, nomeProfessor, pais, estado, cidade, nomeEscola, salaLocal,
          codigoBNCC, descricaoBNCC, hatEnabled, hatColor, hatLogo,
          nomeDiretor, nomeRecepcionista, nomeSecretario,
          disciplina, objetivoAula, turno, proximosEventos, avisosGerais, eventosHoje,
          public_enabled, public_password, public_slug
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          public_enabled = excluded.public_enabled,
          public_password = excluded.public_password,
          public_slug = excluded.public_slug,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        effectiveUserId, webhookUrl, jwtToken, corDestaque, vozIndex,
        parseFloat(velocidadeFala), parseInt(timeoutSonolencia), sessaoId, isKidsMode ? 1 : 0, sanitize(topicDia), parseInt(volumeRobo),
        sanitize(robotName), sanitize(nomeProfessor), sanitize(pais), sanitize(estado), sanitize(cidade), sanitize(nomeEscola), sanitize(salaLocal),
        sanitize(codigoBNCC), sanitizeLarge(descricaoBNCC), hatEnabled ? 1 : 0, sanitize(hatColor), sanitize(hatLogo),
        sanitize(nomeDiretor), sanitize(nomeRecepcionista), sanitize(nomeSecretario),
        sanitize(disciplina), sanitizeLarge(objetivoAula), sanitize(turno), sanitizeLarge(proximosEventos), sanitizeLarge(avisosGerais), sanitizeLarge(eventosHoje),
        publicEnabled ? 1 : 0, sanitize(publicPassword), currentSlug
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save config error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
