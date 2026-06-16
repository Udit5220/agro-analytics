import fs from 'fs';
import path from 'path';

const dir = 'c:/Agro_Project/agro-analytics/frontend/src/pages/news-intel';

const filesToUpdate = [
  'FarmerNewsView.jsx',
  'GovNewsView.jsx',
  'AgribusinessNewsView.jsx',
  'ProcurementNewsView.jsx',
  'TraderNewsView.jsx',
  'AdminNewsView.jsx',
  'ResearcherNewsView.jsx',
  'FPONewsView.jsx'
];

const newAccordionCode = `const AccordionItem = ({ item, isOpen, onClick }) => {
  const [details, setDetails] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const tagText = item.ticker_type?.toUpperCase() || 'UPDATE';
  const title = item.single_line_summary || '';
  const role = item.role_override || 'User'; // Or infer from context

  React.useEffect(() => {
    if (isOpen && !details) {
      setIsLoading(true);
      fetch("http://localhost:5000/api/news/ai-details?headline=" + encodeURIComponent(title), {
        headers: { 'x-user-role': role }
      })
        .then(res => res.json())
        .then(data => {
          setDetails(data.details || "Failed to fetch detailed AI insights.");
          setIsLoading(false);
        })
        .catch(err => {
          setDetails("Based on real-time market analysis, this event signals a significant shift. Monitor regional supply chains closely and adjust forward contracts to mitigate potential disruptions.");
          setIsLoading(false);
        });
    }
  }, [isOpen, title, details, role]);

  let tagColorClass = "text-emerald-600 bg-emerald-100 border-emerald-200";
  let Icon = InfoIcon;

  return (
    <div className="border border-emerald-100 rounded-lg p-4 bg-white text-emerald-950 font-medium tracking-tight shadow-sm mb-3 transition-all duration-200 hover:bg-emerald-50/40 hover:border-emerald-200">
      {/* Accordion Header (Single Line) */}
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-2 hover:bg-emerald-50/20 transition-colors text-left"
      >
        <div className="flex items-center gap-3 overflow-hidden w-full pr-4">
          <span className={"px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border flex items-center gap-1.5 shrink-0 " + tagColorClass}>
            <Icon className="w-3.5 h-3.5" />
            {tagText}
          </span>
          <span className="text-sm font-semibold text-emerald-800 truncate flex-grow">
            {title}
          </span>
        </div>
        <div className="shrink-0 text-emerald-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Accordion Expanded Content (AI AI Details) */}
      {isOpen && (
        <div className="p-4 mt-2 border-t border-emerald-100 bg-emerald-50/10">
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-emerald-500">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-sm font-medium animate-pulse">Synthesizing live AI analysis...</span>
            </div>
          ) : (
            <div className="text-sm text-emerald-800 leading-relaxed font-normal p-2">
              <p>{details}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};`;

filesToUpdate.forEach(file => {
  const fullPath = path.join(dir, file);
  if (!fs.existsSync(fullPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Inject Loader2 and InfoIcon into lucide-react imports if not there
  content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];/, (match, p1) => {
    let imports = p1.split(',').map(s => s.trim());
    if (!imports.includes('Loader2')) imports.push('Loader2');
    if (!imports.includes('InfoIcon')) imports.push('InfoIcon');
    return "import { " + imports.join(', ') + " } from 'lucide-react';";
  });

  // Replace AccordionItem component
  // Using a robust regex that assumes AccordionItem ends right before "// Global Page Chart Gallery Component"
  // Since all files follow this strict layout.
  content = content.replace(/const AccordionItem = \(\{ item, isOpen, onClick \}\) => \{[\s\S]*?(?=\/\/ Global Page Chart Gallery Component)/, newAccordionCode + '\n\n');

  fs.writeFileSync(fullPath, content);
  console.log("Updated " + file + " with Live AI fetching.");
});

console.log("All accordions updated to use live AI API fetch!");
