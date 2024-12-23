using System.Linq.Expressions;

namespace App.Repositories;

public interface IGenericRepository<T> where T : class
{
    ValueTask AddAsync(T entity);
    
    void Delete(T entity);
    
    IQueryable<T> GetAll();
    
    ValueTask<T?> GetByIdAsync(int id);
    
    void Update(T entity);
    
    IQueryable<T> Where(Expression<Func<T, bool>> predicate);
}