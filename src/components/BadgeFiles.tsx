/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BadgeFilesProps {
  listFiles: any[]  
}

const BadgeFiles = ({
  listFiles,
}:BadgeFilesProps) => {
  
  const qtdFiles = listFiles ? listFiles.length : 0


  return (       
    <span className="badge-files">
      {qtdFiles}
    </span>    
  );
};

export default BadgeFiles;
