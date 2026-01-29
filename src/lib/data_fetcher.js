import Papa from 'papaparse';

// CDレビュー用：Googleスプレッドシートの公開URL
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTaV1KLDYy4e1Y_2h6oo79s2D7a6XNHy4M278FFu8Qup5QtW6ZitzDffYabxm2a8owPofqzVbM0Xi95/pub?gid=0&single=true&output=csv';

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

// Aboutページのデータを取得する関数
export async function fetchAboutData() {
  try {
    const response = await fetch(ABOUT_TXT_URL);
    const rawText = await response.text();
    
    // デバッグ用: 取得したテキストの先頭100文字をコンソールに出す
    console.log("Fetched About Text Preview:", rawText.substring(0, 100));

    // BOM (Byte Order Mark) がある場合は削除
    const text = rawText.replace(/^\uFEFF/, '');

    // セクション分割のロジックを強化
    // 正規表現で分割を試みる
    let sections = text.split(/## Section \d+:[^\n]*\r?\n/);

    // もし分割できていなければ（配列が1つだけなら）、キーワードでの単純分割を試みる
    if (sections.length < 3) {
       // "## Section" という文字で無理やり分ける
       const roughParts = text.split('## Section');
       if (roughParts.length >= 3) {
          // 各パーツの1行目（タイトル部分）を削除して本文にする
          sections = roughParts.map(part => {
             const lines = part.split('\n');
             lines.shift(); // 1行目を捨てる
             return lines.join('\n');
          });
       }
    }

    // データ抽出
    // splitの結果、sections[0]はヘッダー前の文章なので無視、[1]がSection 1、[2]がSection 2
    let siteDescription = sections[1] ? sections[1].trim() : "読み込みエラー: '## Section 1' が見つかりませんでした。Googleドキュメントの記述形式を確認してください。";
    let profileDescription = sections[2] ? sections[2].trim() : "読み込みエラー: '## Section 2' が見つかりませんでした。Googleドキュメントの記述形式を確認してください。";

    // Googleドキュメントでの「改行」を、WEB上での「改段落（空行を入れる）」として扱うための処理
    // 通常の改行コード(\n)を、2連続の改行コード(\n\n)に置換します。
    // これにより、CSSの whitespace-pre-wrap が効いている環境で、行間に余白が生まれます。
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