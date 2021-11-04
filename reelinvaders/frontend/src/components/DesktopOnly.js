import "./DesktopOnly.css";

// Currently reelinvaders is not optimized for mobile

export default function DesktopOnly() {
  return (
    <div className="noMobileMessage">
      ⚠ Please use on a computer with a color monitor and a minimum resolution
      of 1400px wide. ⚠
    </div>
  );
}
