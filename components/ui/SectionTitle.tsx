interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

// 統一各頁面的區塊標題樣式
export default function SectionTitle({ title, subtitle, center = false }: SectionTitleProps) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      <h2 className="section-title">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-gray-500 text-base leading-relaxed max-w-2xl"
          style={{ marginLeft: center ? 'auto' : undefined, marginRight: center ? 'auto' : undefined }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
