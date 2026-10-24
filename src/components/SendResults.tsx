"use client";

export function SendResults({ results }: { results: any }) {
  if (results.error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-red-600">Error</h2>
        <p className="text-sm text-gray-700">{results.error}</p>
      </div>
    );
  }

  const failures = results.results?.filter((r: any) => !r.success) || [];

  const downloadFailures = () => {
    const csv = ["Name,Email,Error"];
    failures.forEach((f: any) => {
      csv.push(`"${f.name.replace(/"/g, '""')}","${f.email.replace(/"/g, '""')}","${(f.error || "").replace(/"/g, '""')}"`);
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "failed-recipients.csv";
    a.click();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Sending Results</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold">{results.total}</p>
        </div>
        <div className="p-4 bg-green-50 rounded">
          <p className="text-sm text-gray-600">Successful</p>
          <p className="text-2xl font-bold text-green-600">{results.successful}</p>
        </div>
        <div className="p-4 bg-red-50 rounded">
          <p className="text-sm text-gray-600">Failed</p>
          <p className="text-2xl font-bold text-red-600">{results.failed}</p>
        </div>
      </div>
      {failures.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Failed Recipients</h3>
            <button onClick={downloadFailures} className="px-3 py-1 text-sm border rounded">Download Failed Recipients CSV</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {failures.map((f: any, i: number) => (
                  <tr key={i}>
                    <td className="px-4 py-2 text-sm">{f.name}</td>
                    <td className="px-4 py-2 text-sm">{f.email}</td>
                    <td className="px-4 py-2 text-sm text-red-600">{f.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
