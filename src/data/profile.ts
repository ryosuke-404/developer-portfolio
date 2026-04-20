export const profile = {
  name: 'Yoshioka Ryosuke',
  nameLines: ['Yoshioka', 'Ryosuke'],
  role: 'Creative Developer & Designer',
  tagline: '日常の小さな驚きをデザインに変える',
  developerImage: '/profile.jpeg',
  profileImage: '/profile.jpeg',

  about: {
    intro:
      'デジタルの中に、人らしさを残すことを大切にしています。無機質になりがちなデジタルの中でも、人の温もりや柔らかさを感じられるプロダクトを作りたいと思っています。',
    story: [
      {
        year: '2020',
        title: 'コードとの出会い',
        text: '生物コースに在籍していましたが、高校の情報の授業で初めてパソコンに触れた瞬間、強い衝撃を受けました。これに人生をかけたいと直感し、その体験をきっかけに情報・理工分野への進路を志しました。',
      },
      {
        year: '2022',
        title: 'セキュリティへの関心',
        text: 'コードだけでなく、その裏側にある仕組みや安全性にも関心を持つようになりました。ユーザーが安心して使える体験を支える技術に興味を深め、立命館大学情報理工学部セキュリティ・ネットワークコースへ進学しました。',
      },
      {
        year: '2024',
        title: '研究室での取り組み',
        text: '情報ネットワーキング研究室に所属し、IoTやUAVを活用したデータ収集において、その信頼性とプライバシーを担保するためのブロックチェーン技術の研究に取り組みました。',
      },
      {
        year: '2026 →',
        title: '現在進行形',
        text: '新しい技術と古い価値観を組み合わせながら、人の記憶に残るプロダクトを作り続けています。今日もまだ、昨日知らなかったことを学んでいます。',
      },
    ],
  },

  skills: {
    featured: 'インターフェースから知能処理・エッジ・信頼性まで、4層を横断して設計・実装できます。',
    stats: [
      { value: '5+', label: '年の経験' },
      { value: '20+', label: 'プロジェクト' },
    ],

    // 4-layer architecture
    layers: [
      {
        label: 'Interface',
        labelJa: 'インターフェース層',
        color: '#4f8c62',
        items: ['React', 'Next.js', 'Flutter', 'Swift', 'Kotlin', 'Tailwind CSS'],
      },
      {
        label: 'Intelligence',
        labelJa: '知能処理層',
        color: '#8b7ec8',
        items: ['OpenCV', 'YOLO', 'CNN', 'PyTorch', 'TensorFlow', 'MediaPipe'],
      },
      {
        label: 'Edge',
        labelJa: 'エッジ・実行層',
        color: '#6db89a',
        items: ['NVIDIA Jetson', 'Raspberry Pi', 'ESP32', 'AWS'],
      },
      {
        label: 'Trust',
        labelJa: '信頼性担保層',
        color: '#c4956a',
        items: ['ZKP', 'Circom', 'IPFS', 'Smart Contract', 'Plonky2'],
      },
    ],

    // Detailed categories with levels
    categories: [
      {
        label: '言語',
        items: [
          { name: 'Python',     level: 'advanced'     as const },
          { name: 'Dart',       level: 'intermediate' as const },
          { name: 'JavaScript', level: 'intermediate' as const },
          { name: 'Java',       level: 'beginner'     as const },
          { name: 'Kotlin',     level: 'beginner'     as const },
          { name: 'Swift',      level: 'beginner'     as const },
          { name: 'Go',         level: 'beginner'     as const },
        ],
      },
      {
        label: 'ML / CV',
        items: [
          { name: 'OpenCV',    level: 'advanced'     as const },
          { name: 'YOLO',      level: 'advanced'     as const },
          { name: 'PyTorch',   level: 'intermediate' as const },
          { name: 'TensorFlow',level: 'intermediate' as const },
          { name: 'MediaPipe', level: 'intermediate' as const },
          { name: 'CNN',       level: 'intermediate' as const },
          { name: 'DeepFace',  level: 'intermediate' as const },
          { name: 'SSRNet',    level: 'intermediate' as const },
        ],
      },
      {
        label: 'Web / Mobile',
        items: [
          { name: 'React',       level: 'intermediate' as const },
          { name: 'Next.js',     level: 'intermediate' as const },
          { name: 'Flutter',     level: 'intermediate' as const },
          { name: 'Tailwind CSS',level: 'intermediate' as const },
          { name: 'Swift (iOS)', level: 'beginner'     as const },
          { name: 'Kotlin (Android)', level: 'beginner' as const },
        ],
      },
      {
        label: 'ZKP / Web3',
        items: [
          { name: 'ZKP',            level: 'advanced'     as const },
          { name: 'Circom',         level: 'intermediate' as const },
          { name: 'IPFS',           level: 'intermediate' as const },
          { name: 'Smart Contract', level: 'intermediate' as const },
          { name: 'zkWASM',         level: 'beginner'     as const },
          { name: 'Plonky2',        level: 'beginner'     as const },
        ],
      },
      {
        label: 'Edge / HW',
        items: [
          { name: 'NVIDIA Jetson', level: 'advanced'     as const },
          { name: 'Raspberry Pi',  level: 'intermediate' as const },
          { name: 'ESP32',         level: 'intermediate' as const },
          { name: 'AWS',           level: 'beginner'     as const },
        ],
      },
      {
        label: 'Algorithms',
        items: [
          { name: 'HRV解析',      level: 'intermediate' as const },
          { name: 'PCA',          level: 'intermediate' as const },
          { name: 'SVM',          level: 'intermediate' as const },
          { name: 'Merkle Tree',  level: 'intermediate' as const },
        ],
      },
    ],

    tools: [
      'Python', 'PyTorch', 'OpenCV', 'YOLO', 'Flutter', 'React', 'Next.js',
      'NVIDIA Jetson', 'Raspberry Pi', 'ESP32', 'ZKP', 'Circom', 'IPFS',
      'Docker', 'Git / GitHub', 'AWS', 'Node.js', 'Figma', 'Vercel',
    ],
    soft: [
      { label: '問題解決力', icon: '◈' },
      { label: '好奇心',     icon: '◎' },
      { label: '丁寧さ',     icon: '✦' },
      { label: '学習継続力', icon: '⟳' },
    ],
  },

  experience: [
    {
      period: '2022',
      phase: '基礎構築フェーズ',
      role: '理論基盤の確立',
      description: '基礎的な数理モデルとプログラミング能力の獲得を目的とした段階。データ解析の理論理解と実装の初期統合を行った。',
      highlight: 'データ解析の理論理解と実装の初期統合',
      tags: ['Python', 'Java', 'SVM', 'PCA'],
    },
    {
      period: '2023',
      phase: '応用・画像処理フェーズ',
      role: '実データ処理の習得',
      description: '理論から応用へ移行し、現実データ（画像・生体信号）を扱う能力を獲得。入力データ → 特徴抽出 → 推定の流れを実装レベルで理解した。',
      highlight: '現実データ（画像・生体信号）を扱う能力の獲得',
      tags: ['OpenCV', 'CNN', 'TensorFlow', 'PyTorch', 'HRV解析'],
    },
    {
      period: '2024',
      phase: '統合・IoTフェーズ',
      role: '実世界統合システムの構築',
      description: '複数技術を統合し、「現実空間 → センサ → AI解析」までの一貫処理系を構築。リアルタイム処理と低計算資源環境（Jetson）への適応が進んだ。',
      highlight: '「現実空間 → センサ → AI解析」の一貫処理系',
      tags: ['YOLO', 'NVIDIA Jetson', 'Raspberry Pi', 'ESP32', 'SSRNet', 'DeepFace', 'MediaPipe'],
    },
    {
      period: '2025',
      phase: '信頼性・暗号統合フェーズ',
      role: '検証可能システムの設計',
      description: '単なるAIシステムから進化し、「結果を正しいと証明する」信頼性レイヤを追加。AIの出力・IoTデータに対して検証可能性（Verifiability）を付与する設計思想を確立した。',
      highlight: 'AIとIoTデータへの検証可能性（Verifiability）の付与',
      tags: ['ZKP', 'Circom', 'マークルツリー', 'スマートコントラクト', 'IPFS', 'Plonky2'],
    },
    {
      period: '2026',
      phase: 'フロント・プロダクトフェーズ',
      role: 'インターフェース層の構築',
      description: 'これまでの技術をユーザに届けるためのインターフェース層（UI/UX）の構築へ拡張。Web・モバイルアプリによるプロダクト化を推進中。',
      highlight: '「データ取得 → 解析 → 証明 → 提供」を一貫して設計する能力の完成',
      tags: ['React', 'Next.js', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'AWS'],
    },
  ],

  works: [
    {
      id: 'emotiondiary',
      title: 'Emotion Diary',
      role: 'Design & Development',
      description:
        '日々の感情を記録・可視化するモバイルアプリ。シンプルなUIで毎日の気持ちをログし、振り返りやセルフケアをサポートする。',
      tags: ['Flutter', 'Hive', 'Figma'],
      accent: '#4f8c62',
      year: '2024',
      image: '/works/emotiondiary/1record.png',
      images: [
        '/works/emotiondiary/1record.png',
        '/works/emotiondiary/2record.png',
        '/works/emotiondiary/3calender.png',
        '/works/emotiondiary/4monthly_trend.png',
        '/works/emotiondiary/5mood.png',
      ] as string[],
      video: null as string | null,
      icon: '/works/emotiondiary/icon-emotiondiary.png',
      href: 'https://smri2170.github.io/Official-Website-of-Emotion-Diary/' as string | null,
      github: 'https://github.com/ryosuke-404/Emotion-Diary' as string | null,
    },
    {
      id: 'oshikatsu',
      title: '推し活日記',
      role: 'Full Stack',
      description:
        '推し活イベントの参加管理・記録アプリ。ライブ・展示・撮影会などのスケジュールをまとめ、思い出を整理できるパーソナルな推し活手帳。',
      tags: ['Flutter', 'Hive'],
      accent: '#8b7ec8',
      year: '2024',
      image: '/works/oshikatsu/1screen-profile.png',
      images: [
        '/works/oshikatsu/1screen-profile.png',
        '/works/oshikatsu/2screen-calendar.png',
        '/works/oshikatsu/3screen-diary.png',
        '/works/oshikatsu/4screen-timeline.png',
        '/works/oshikatsu/5screen-goods.png',
      ] as string[],
      video: null as string | null,
      icon: '/works/oshikatsu/icon-oshikatuniiki.png',
      href: 'https://smri2170.github.io/Official-Website-of-oshi-diary/' as string | null,
      github: 'https://github.com/ryosuke-404/oshikatsu' as string | null,
    },
    {
      id: 'uav',
      title: 'UAV Research App',
      role: 'Research & Development',
      description:
        'ドローン（UAV）の飛行データをリアルタイムで収集・可視化するモバイルアプリ。センサーデータの送受信とフライトログ管理を一元化し、研究活動の効率化を支援する。',
      tags: ['Flutter', 'Python', 'Raspberry Pi', 'web3dart', 'ethers', 'Poseidon', 'camera', 'flutter_blue_plus'],
      accent: '#6db89a',
      year: '2023',
      image: '/works/uav/1demo.gif',
      images: [
        '/works/uav/1demo.gif',
        '/works/uav/2-1reserch-uav-app-photo.jpg',
        '/works/uav/2-2reserch-uav-app-send.jpg',
        '/works/uav/3reserch-uav-demo.jpg',
        '/works/uav/4system-overview.png',
      ] as string[],
      video: null as string | null,
      icon: '/works/uav/icon.png',
      href: null as string | null,
      github: 'https://github.com/ryosuke-404/zerosky' as string | null,
    },
  ],

  values: [
    {
      symbol: '◉',
      title: 'Real-world First',
      sub: '現実世界を起点に考える',
      text: 'データは机上のものではなく、センサや映像など現実から取得するものと捉える。技術は「実際に使われる環境」で成立することを前提に設計する。',
      accent: '#4f8c62',
    },
    {
      symbol: '◈',
      title: 'Verifiability over Accuracy',
      sub: '精度よりも検証可能性を重視する',
      text: 'AIの出力を「信じる」のではなく「証明できる」ことにこだわる。精度の高さより、ゼロ知識証明などを用いた検証可能な設計を優先する。',
      accent: '#8b7ec8',
    },
    {
      symbol: '⟳',
      title: 'End-to-End Ownership',
      sub: '全体を通して責任を持つ',
      text: 'データ取得からUI提供まで分断せず、システム全体を一貫して設計・実装する。',
      accent: '#6db89a',
    },
    {
      symbol: '✦',
      title: 'Build to Understand',
      sub: '実装によって理解する',
      text: '理論や論文の理解に留まらず、実際に動く形に落とし込むことで本質を把握する。',
      accent: '#4f8c62',
    },
    {
      symbol: '◐',
      title: 'Constraint-driven Design',
      sub: '制約から設計する',
      text: '計算資源やリアルタイム性などの制約を前提に、現実的に成立する最適な構成を導く。',
      accent: '#8b7ec8',
    },
  ],

  statement: ['Minimalist Code,', 'Maximalist Impact.'],
  statementSub: 'コードは最小限に、影響は最大限に。',

  now: {
    available: true,
    activity: 'このポートフォリオを作っています',
    location: '大阪, Japan',
    listening: 'City Pop playlist',
  },

  contact: {
    cta: '一緒に、面白いものを作りませんか？',
    sub: 'プロジェクトのご相談、お仕事の依頼、ただの雑談でも歓迎です。',
    email: 'devbyryosuke2025@gmail.com',
    links: [
      { label: 'GitHub',      href: 'https://github.com/ryosuke-404', active: true  },
      { label: 'Twitter / X', href: null,                              active: false },
      { label: 'LinkedIn',    href: null,                              active: false },
    ],
  },
};
