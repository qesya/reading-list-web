export default function MockImage({
  src,
  alt,
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} />;
}