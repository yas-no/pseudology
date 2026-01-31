import Papa from 'papaparse';

// CDレビュー用：Googleスプレッドシートの公開URL
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTaV1KLDYy4e1Y_2h6oo79s2D7a6XNHy4M278FFu8Qup5QtW6ZitzDffYabxm2a8owPofqzVbM0Xi95/pub?gid=0&single=true&output=csv';

// 【重要】ここに取得した「annual_ranks」シートのCSV URLを貼り付けてください
const ANNUAL_RANKS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTaV1KLDYy4e1Y_2h6oo79s2D7a6XNHy4M278FFu8Qup5QtW6ZitzDffYabxm2a8owPofqzVbM0Xi95/pub?gid=473900344&single=true&output=csv'; 

// Aboutページ用：GoogleドキュメントのID
const ABOUT_DOC_ID = '1CKRsItDhxKZtdam84d5sPFXCuxrhgptAg0f63Y5ULLk';
const ABOUT_TXT_URL = `https://docs.google.com/document/d/${ABOUT_DOC_ID}/export?format=txt`;

function getDriveImageUrl(fileId) {
  if (!fileId) return null;
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

// レビューデータを取得する関数
export async function fetchReviews() {
  try {
    if (!SHEET_CSV_URL) return [];

    const response = await fetch(SHEET_CSV_URL);
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    const reviews = parsed.data.map((row, index) => ({
      id: index + 1,
      artist: row.artist,
      title: row.title,
      body: row.body,
      date: row.date || null,
      image: row.image_id ? getDriveImageUrl(row.image_id) : null,
      color: `hsl(${Math.random() * 360}, 70%, 25%)` 
    }));

    return reviews.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });

  } catch (error) {
    console.error("データの取得に失敗しました:", error);
    return [];
  }
}

// 【新規追加】年間ベストデータを取得する関数 (ログ削除版)
export async function fetchAnnualRanks() {
  try {
    // URL設定チェック
    if (!ANNUAL_RANKS_CSV_URL || ANNUAL_RANKS_CSV_URL.includes('ここに')) {
        return [];
    }

    const response = await fetch(ANNUAL_RANKS_CSV_URL);
    
    // レスポンスチェック
    if (!response.ok) {
        return [];
    }

    const csvText = await response.text();

    // header: false にして、配列インデックスでアクセスするように変更
    const parsed = Papa.parse(csvText, {
      header: false, 
      skipEmptyLines: true,
    });

    // データを整形して返す
    const formattedData = parsed.data
      .map((row, i) => {
        // もし1行目に「year」などのヘッダー文字が含まれていた場合はスキップ
        if (i === 0 && (row[0] === 'year' || row[0] === '年度')) {
            return null;
        }

        // 列の定義: [0]:year, [1]:rank, [2]:artist, [3]:title, [4]:comment
        const year = row[0];
        const rank = row[1];

        // 必須フィールドのチェック
        if (!year || rank === undefined || rank === '') {
            return null;
        }

        return {
          year: year.toString(),
          rank: parseInt(rank, 10), // 数値に変換
          artist: row[2] ? row[2].trim() : "",
          title: row[3] ? row[3].trim() : "",
          comment: row[4] || ""
        };
      })
      .filter(item => item !== null); // 無効な行を除外

    return formattedData;

  } catch (error) {
    console.error("年間ベストデータの取得に失敗しました:", error);
    return [];
  }
}

// Aboutページのデータを取得する関数
export async function fetchAboutData() {
  try {
    const response = await fetch(ABOUT_TXT_URL);
    const rawText = await response.text();
    
    // BOM (Byte Order Mark) がある場合は削除
    const text = rawText.replace(/^\uFEFF/, '');

    // セクション分割のロジックを強化
    let sections = text.split(/## Section \d+:[^\n]*\r?\n/);

    if (sections.length < 3) {
       const roughParts = text.split('## Section');
       if (roughParts.length >= 3) {
          sections = roughParts.map(part => {
             const lines = part.split('\n');
             lines.shift(); 
             return lines.join('\n');
          });
       }
    }

    let siteDescription = sections[1] ? sections[1].trim() : "読み込みエラー";
    let profileDescription = sections[2] ? sections[2].trim() : "読み込みエラー";

    siteDescription = siteDescription.replace(/\n/g, '\n\n');
    profileDescription = profileDescription.replace(/\n/g, '\n\n');

    return { siteDescription, profileDescription };

  } catch (error) {
    console.error("Aboutデータの取得に失敗しました:", error);
    return {
      siteDescription: "データの読み込みに失敗しました。",
      profileDescription: "データの読み込みに失敗しました。"
    };
  }
}