import { useState } from 'react';
import SearchInput from '@components/SearchInput';
import SelectDropdown from '@components/SelectDropdown';
import Button from '@components/Button';
import Card from '@components/Card';

function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Artists');

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <SearchInput
          id="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="What are you looking for?"
        />
        <SelectDropdown
          id="category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          options={['Artists', 'Albums', 'Songs']}
        />
        <Button
          onClick={() => alert(`Search: ${search}, Category: ${category}`)}
        >
          Search
        </Button>
      </div>

      <h2>My top artists —</h2>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            title="Laufey"
            subtitle="jazz, pop, bossa nova, and classica"
            imageUrl="https://mundoindie.mx/wp-content/uploads/2025/04/Laufey-MEXICO.png"
            link={'#'}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
