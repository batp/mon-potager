export function PlaceholderBanner() {
  if (process.env.NEXT_PUBLIC_SHOW_PLACEHOLDER_BANNER !== "true") {
    return null;
  }

  return (
    <div
      className="border-b border-[#E8A838]/40 bg-[#E8A838]/15 px-4 py-2 text-center text-sm text-[#3D3229]"
      role="status"
    >
      Version beta — illustrations et icônes temporaires (placeholders)
    </div>
  );
}
