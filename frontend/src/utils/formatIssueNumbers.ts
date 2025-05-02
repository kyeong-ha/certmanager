export function formatIssueNumbers(issueNumbers: string[]): string {
    if (issueNumbers.length === 0) return "";
  
    const sorted = [...issueNumbers].sort();
    const ranges: string[] = [];
    let start = sorted[0];
    let end = start;
  
    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const prevNum = parseInt(end.split("-").pop() || "0", 10);
      const currNum = parseInt(current.split("-").pop() || "0", 10);
  
      if (currNum === prevNum + 1) {
        end = current;
      } else {
        if (start === end) {
          ranges.push(start);
        } else {
          ranges.push(`${start}~${end}`);
        }
        start = end = current;
      }
    }
    
    if (start === end) {
      ranges.push(start);
    } else {
      ranges.push(`${start}~${end}`);
    }
  
    return ranges.join(", ");
  }