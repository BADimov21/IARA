using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using IARA.Persistence.Data.Entities;

namespace IARA.Persistence.Data.Entities;

public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int UserId { get; set; }
    
    [Required]
    [MaxLength(100)]
    [Column(TypeName = "nvarchar(100)")]
    public string Username { get; set; }

    [Required]
    [MaxLength(255)]
    [Column(TypeName = "nvarchar(255)")]
    public string PasswordHash { get; set; }

    [Required]
    [MaxLength(255)]
    [EmailAddress]
    [Column(TypeName = "nvarchar(255)")]
    public string Email { get; set; }

    [Required]
    [MaxLength(50)]
    [Column(TypeName = "nvarchar(50)")]
    public string UserType { get; set; }

    [ForeignKey("Person")]
    public int? PersonId { get; set; }

    [Required]
    public bool IsActive { get; set; } = true;

    [Required]
    [Column(TypeName = "datetime2")]
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "datetime2")]
    public DateTime? LastLoginDate { get; set; }

    public virtual Person? Person { get; set; }
}