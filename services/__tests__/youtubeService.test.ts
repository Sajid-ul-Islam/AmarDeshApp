import {
  categorizeAmarDeshVideo,
  cleanVideoTitle,
  formatBengaliRelativeDate,
  parseYouTubeFeedXml,
  CURATED_AMAR_DESH_VIDEOS,
  VIDEO_CATEGORIES,
  AMAR_DESH_YT_CHANNEL_ID,
  AMAR_DESH_YT_CHANNEL_URL,
  fetchAmarDeshVideos,
} from '../youtubeService';

describe('YouTube Service & Amar Desh Channel Integration', () => {
  it('has correct channel ID and official channel URL', () => {
    expect(AMAR_DESH_YT_CHANNEL_ID).toBe('UCVBUCoStRou7DZtlTxmhAmQ');
    expect(AMAR_DESH_YT_CHANNEL_URL).toBe(
      'https://www.youtube.com/channel/UCVBUCoStRou7DZtlTxmhAmQ'
    );
  });

  it('categorizes video titles accurately into Bengali categories', () => {
    expect(
      categorizeAmarDeshVideo('মিড ডে নিউজ: নতুন অধ্যাদেশ জারি')
    ).toBe('তাজা খবর');

    expect(
      categorizeAmarDeshVideo('জুলাই বিপ্লবের শহীদদের স্মরণে বিশেষ আয়োজন')
    ).toBe('জুলাই বিপ্লব');

    expect(
      categorizeAmarDeshVideo('উপ সম্পাদকীয়: রাজনৈতিক দলগুলোর সংস্কার ভাবনা')
    ).toBe('মতামত ও বিশ্লেষণ');

    expect(
      categorizeAmarDeshVideo('এআই প্রযুক্তির বিপ্লব এবং ভবিষ্যতের চ্যালেঞ্জ')
    ).toBe('তথ্যপ্রযুক্তি');

    expect(
      categorizeAmarDeshVideo('বিপিএল ক্রিকেটে রোমাঞ্চকর জয়')
    ).toBe('খেলাধুলা');

    expect(
      categorizeAmarDeshVideo('জরুরি তলবে মোদির পর ট্রাম্পের সাথে বৈঠক')
    ).toBe('আন্তর্জাতিক');

    expect(
      categorizeAmarDeshVideo('দিনাজপুর সীমান্তে বিএসএফের তৎপরতা')
    ).toBe('সারা দেশ');

    expect(
      categorizeAmarDeshVideo('বাংলাদেশ ব্যাংকের নতুন গভর্নর ও মূল্যস্ফীতি')
    ).toBe('অর্থনীতি');

    expect(
      categorizeAmarDeshVideo('বিএনপি ও জামায়াতের যৌথ সংবাদ সম্মেলন')
    ).toBe('রাজনীতি');
  });

  it('cleans up channel suffixes from video titles', () => {
    expect(cleanVideoTitle('জরুরি খবর প্রকাশ | Amar Desh')).toBe('জরুরি খবর প্রকাশ');
    expect(cleanVideoTitle('আজকের প্রধান খবর | আমার দেশ')).toBe('আজকের প্রধান খবর');
    expect(cleanVideoTitle('স্বাভাবিক শিরোনাম')).toBe('স্বাভাবিক শিরোনাম');
  });

  it('formats relative ISO dates into Bengali relative strings', () => {
    const now = new Date();
    const tenMinAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString();

    expect(formatBengaliRelativeDate(tenMinAgo)).toContain('মিনিট আগে');
    expect(formatBengaliRelativeDate(threeHoursAgo)).toContain('ঘণ্টা আগে');
    expect(formatBengaliRelativeDate(oneDayAgo)).toBe('১ দিন আগে');
  });

  it('parses Atom XML feed from YouTube into structured video items', () => {
    const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <entry>
    <id>yt:video:TEST_ID_1</id>
    <yt:videoId>TEST_ID_1</yt:videoId>
    <title>মিড ডে নিউজ: নতুন সংস্কার উদ্যোগ | Amar Desh</title>
    <published>2026-10-07T10:00:00+00:00</published>
    <media:group>
      <media:thumbnail url="https://i.ytimg.com/vi/TEST_ID_1/hqdefault.jpg"/>
      <media:community>
        <media:statistics views="12500"/>
      </media:community>
    </media:group>
  </entry>
</feed>`;

    const items = parseYouTubeFeedXml(mockXml);
    expect(items).toHaveLength(1);
    expect(items[0].youtubeId).toBe('TEST_ID_1');
    expect(items[0].title).toBe('মিড ডে নিউজ: নতুন সংস্কার উদ্যোগ');
    expect(items[0].category).toBe('তাজা খবর');
    expect(items[0].thumbnailUrl).toBe('https://i.ytimg.com/vi/TEST_ID_1/hqdefault.jpg');
    expect(items[0].views).toBe(12500);
  });

  it('curated videos have valid IDs and categories from allowed list', () => {
    expect(CURATED_AMAR_DESH_VIDEOS.length).toBeGreaterThanOrEqual(10);
    for (const v of CURATED_AMAR_DESH_VIDEOS) {
      expect(v.youtubeId).toBeDefined();
      expect(v.youtubeId.length).toBeGreaterThan(0);
      expect(v.title.length).toBeGreaterThan(5);
      expect(v.thumbnailUrl).toContain('i.ytimg.com');
      expect(VIDEO_CATEGORIES).toContain(v.category);
    }
  });

  it('fetches videos falling back gracefully to curated list when offline', async () => {
    const videos = await fetchAmarDeshVideos(false);
    expect(videos.length).toBeGreaterThanOrEqual(10);
    expect(videos[0].youtubeId).toBeDefined();
  });
});
