using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace App.Repositories;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    private readonly DbSet<T> _dbSet;
    protected AppDbContext context;
    
    public GenericRepository(AppDbContext context) 
    {
        this.context = context;
        _dbSet  = context.Set<T>();
    }
    
    public async ValueTask AddAsync(T entity) => await _dbSet.AddAsync(entity); 
    
    public void Delete(T entity) => _dbSet.Remove(entity);
    
    public IQueryable<T> GetAll() => _dbSet.AsQueryable().AsNoTracking();
    
    public ValueTask<T?> GetByIdAsync(int id) => _dbSet.FindAsync(id);
    
    public void Update(T entity) => _dbSet.Update(entity);
    
    public IQueryable<T> Where(Expression<Func<T, bool>> predicate) => _dbSet.Where(predicate);
}