import styles from './PopularSongsTable.module.css';

type Song = {
  name: string;
  timesPlayed: number;
  length: string;
};

type PopularSongsTableProps = {
  songs: Song[];
};

function PopularSongsTable({ songs }: PopularSongsTableProps) {
  return (
    <div className={styles.container}>
      <h2>Popular songs</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Image</th>
            <th>Song Name</th>
            <th>Times Played</th>
            <th>Song Length</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>O</td>
              <td>{song.name}</td>
              <td>{song.timesPlayed.toLocaleString()}</td>
              <td>{song.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PopularSongsTable;
