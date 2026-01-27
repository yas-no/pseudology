import Papa from 'papaparse';

// ここにGoogleスプレッドシートの公開URL（CSV形式）を貼り付けます
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTaV1KLDYy4e1Y_2h6oo79s2D7a6XNHy4M278FFu8Qup5QtW6ZitzDffYabxm2a8owPofqzVbM0Xi95/pub?output=csv';

function getDriveImageUrl(fileId) {
  if (!fileId) return null;
  // Google Driveの画像を直リンク形式に変換
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

export async function fetchReviews() {
  try {
    // URLが設定されていない場合は空配列を返す（エラーにならないように）
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
      // 日付がない場合はnullにする
      date: row.date || null,
      // 画像IDがあればURLに変換、なければnull
      image: row.image_id ? getDriveImageUrl(row.image_id) : null,
      // 画像がない場合の背景色（ランダム生成）
      color: `hsl(${Math.random() * 360}, 70%, 25%)` 
    }));

    // 日付順（新しい順）にソート。日付がないものは後ろへ。
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