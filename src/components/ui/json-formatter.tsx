import React from 'react';

interface JsonFormatterProps {
  data: Record<string, any>;
  indent?: number;
}

const JsonNode: React.FC<{ data: any; level: number; indent: number }> = ({ data, level, indent }) => {
  const indentation = ' '.repeat(level * indent);

  if (typeof data === 'string') {
   
    if (data.includes('\n') || data.length > 80) {
      return (
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0, padding: 0, display: 'inline-block' }}>
          {JSON.stringify(data).slice(1, -1)} 
        </pre>
      );
    }
    return <span className="text-green-400">"{data}"</span>;
  }

  if (typeof data === 'number') {
    return <span className="text-blue-400">{data}</span>;
  }

  if (typeof data === 'boolean') {
    return <span className="text-purple-400">{String(data)}</span>;
  }

  if (data === null) {
    return <span className="text-gray-400">null</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span>[]</span>;
    }
    return (
      <>
        <span>[</span>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            {'\n'}
            {' '.repeat((level + 1) * indent)}
            <JsonNode data={item} level={level + 1} indent={indent} />
            {index < data.length - 1 ? ',' : ''}
          </React.Fragment>
        ))}
        {'\n'}
        {indentation}
        <span>]</span>
      </>
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return <span>{}</span>;
    }
    return (
      <>
        <span>{'{'}</span>
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            {'\n'}
            {' '.repeat((level + 1) * indent)}
            <span className="text-yellow-400">"{key}"</span>: <JsonNode data={data[key]} level={level + 1} indent={indent} />
            {index < keys.length - 1 ? ',' : ''}
          </React.Fragment>
        ))}
        {'\n'}
        {indentation}
        <span>{'}'}</span>
      </>
    );
  }

  return <span className="text-red-400">{String(data)}</span>; 
};

export const JsonFormatter: React.FC<JsonFormatterProps> = ({ data, indent = 2 }) => {
  return (
    <pre className="p-3 bg-gray-800 rounded-lg body-sm font-mono overflow-auto text-white">
      <code>
        <JsonNode data={data} level={0} indent={indent} />
      </code>
    </pre>
  );
};
